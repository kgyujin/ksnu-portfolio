# Docker & Kubernetes 배포 아키텍처

## 1. Docker 컨테이너 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                   Docker Compose Architecture                     │
└──────────────────────────────────────────────────────────────────┘

docker-compose.yml
├── services:
│   ├── frontend (nginx:alpine)
│   │   ├── Build: Vite production build
│   │   ├── Port: 80:80
│   │   ├── Volume: ./frontend/dist → /usr/share/nginx/html
│   │   └── Network: portfolio-network
│   │
│   ├── api (node:18-alpine)
│   │   ├── Build: ./backend/Dockerfile
│   │   ├── Port: 3000:3000
│   │   ├── Environment:
│   │   │   ├── MONGODB_URI
│   │   │   ├── MYSQL_HOST=mysql
│   │   │   ├── NODE_ENV=production
│   │   │   └── API_PORT=3000
│   │   ├── Depends: [mongodb, mysql]
│   │   ├── Health Check: curl http://localhost:3000/health
│   │   └── Network: portfolio-network
│   │
│   ├── mongodb (mongo:8.0)
│   │   ├── Port: 27017:27017
│   │   ├── Environment:
│   │   │   ├── MONGO_INITDB_ROOT_USERNAME
│   │   │   └── MONGO_INITDB_ROOT_PASSWORD
│   │   ├── Volume: ./data/mongodb:/data/db
│   │   └── Network: portfolio-network
│   │
│   └── mysql (mysql:8.0)
│       ├── Port: 3306:3306
│       ├── Environment:
│       │   ├── MYSQL_ROOT_PASSWORD
│       │   ├── MYSQL_DATABASE=portfolio_db
│       │   └── MYSQL_USER=portfolio_user
│       ├── Volume:
│       │   ├── ./data/mysql:/var/lib/mysql
│       │   └── ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
│       └── Network: portfolio-network
│
└── networks:
    └── portfolio-network (bridge driver)

┌──────────────────────────────────────────────────────────────────┐
│                    Container Lifecycle Flow                       │
└──────────────────────────────────────────────────────────────────┘

$ docker-compose up -d
         │
         ├─── 1. Create network: portfolio-network
         │
         ├─── 2. Pull/Build images:
         │        ├── mongo:8.0 (pull from Docker Hub)
         │        ├── mysql:8.0 (pull from Docker Hub)
         │        ├── node:18-alpine (build backend)
         │        └── nginx:alpine (build frontend)
         │
         ├─── 3. Create volumes:
         │        ├── data/mongodb
         │        └── data/mysql
         │
         ├─── 4. Start containers (dependency order):
         │        ├── mongodb (first)
         │        ├── mysql (first)
         │        └── api (after mongodb & mysql ready)
         │
         ├─── 5. Health checks:
         │        └── api: curl http://localhost:3000/health
         │            (retry every 30s, max 3 attempts)
         │
         └─── 6. Running state
                  ├── frontend: http://localhost:80
                  ├── api: http://localhost:3000
                  ├── mongodb: mongodb://localhost:27017
                  └── mysql: mysql://localhost:3306
```

## 2. Dockerfile 멀티스테이지 빌드

```
┌──────────────────────────────────────────────────────────────────┐
│              Backend Dockerfile (Multi-stage Build)               │
└──────────────────────────────────────────────────────────────────┘

FROM node:18-alpine AS base
├── Purpose: Base image for all stages
├── Install: curl, git (for health checks)
└── Workdir: /app

┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: Dependencies (deps)                                    │
├─────────────────────────────────────────────────────────────────┤
│  FROM base AS deps                                               │
│  COPY package*.json ./                                           │
│  RUN npm ci --only=production                                    │
│  - Install production dependencies only                          │
│  - Use npm ci for reproducible builds                            │
│  - Result: node_modules (optimized)                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 2: Build (builder)                                        │
├─────────────────────────────────────────────────────────────────┤
│  FROM base AS builder                                            │
│  COPY package*.json ./                                           │
│  RUN npm ci (includes devDependencies)                           │
│  COPY . .                                                        │
│  RUN npm run build (if TypeScript)                              │
│  - Compile TypeScript to JavaScript                              │
│  - Optimize code                                                 │
│  - Result: dist/ folder                                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 3: Production (production)                                │
├─────────────────────────────────────────────────────────────────┤
│  FROM base AS production                                         │
│  WORKDIR /app                                                    │
│  COPY --from=deps /app/node_modules ./node_modules              │
│  COPY --from=builder /app/dist ./dist (or src/)                 │
│  COPY package*.json ./                                           │
│                                                                  │
│  USER node (run as non-root)                                     │
│  EXPOSE 3000                                                     │
│  HEALTHCHECK --interval=30s --timeout=3s \                      │
│    CMD curl -f http://localhost:3000/health || exit 1           │
│  CMD ["node", "src/server.js"]                                  │
│                                                                  │
│  Final Image Size: ~150MB (vs 1GB+ without multi-stage)         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│             Frontend Dockerfile (Static Build)                    │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: Build                                                  │
├─────────────────────────────────────────────────────────────────┤
│  FROM node:18-alpine AS build                                    │
│  WORKDIR /app                                                    │
│  COPY package*.json ./                                           │
│  RUN npm ci                                                      │
│  COPY . .                                                        │
│  RUN npm run build                                              │
│  - Vite optimization                                             │
│  - Code splitting                                                │
│  - Asset compression                                             │
│  - Result: dist/ (optimized static files)                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 2: Production Server                                      │
├─────────────────────────────────────────────────────────────────┤
│  FROM nginx:alpine AS production                                 │
│  COPY --from=build /app/dist /usr/share/nginx/html             │
│  COPY nginx.conf /etc/nginx/nginx.conf                          │
│  EXPOSE 80                                                       │
│  CMD ["nginx", "-g", "daemon off;"]                             │
│                                                                  │
│  Final Image Size: ~25MB (ultra-lightweight)                    │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Kubernetes 클러스터 아키텍처

```
┌──────────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster Overview                     │
└──────────────────────────────────────────────────────────────────┘

                        Internet
                            │
                            ▼
                  ┌──────────────────┐
                  │  Ingress         │
                  │  Controller      │
                  │  (nginx-ingress) │
                  └────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Ingress    │  │   Ingress    │  │   Ingress    │
│   Rules:     │  │   Rules:     │  │   Rules:     │
│   /api/*     │  │   /health    │  │   /*         │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────┐
│                  Namespace: portfolio                         │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              LoadBalancer Service                       │ │
│  │              (portfolio-api-service)                    │ │
│  │              Type: LoadBalancer                         │ │
│  │              Port: 80 → 3000                            │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                    │
│          ┌──────────────┴──────────────┐                    │
│          │                             │                    │
│          ▼                             ▼                    │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  API Pod 1   │              │  API Pod 2   │            │
│  │  (Running)   │              │  (Running)   │            │
│  ├──────────────┤              ├──────────────┤            │
│  │ Container:   │              │ Container:   │            │
│  │ - Image:     │              │ - Image:     │            │
│  │   ghcr.io/   │              │   ghcr.io/   │            │
│  │   portfolio  │              │   portfolio  │            │
│  │   :latest    │              │   :latest    │            │
│  │ - CPU: 500m  │              │ - CPU: 500m  │            │
│  │ - Mem: 512Mi │              │ - Mem: 512Mi │            │
│  │ - Port: 3000 │              │ - Port: 3000 │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                             │                    │
│         └──────────────┬──────────────┘                    │
│                        │                                    │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           ClusterIP Service                          │  │
│  │           (mongodb-service)                          │  │
│  │           Port: 27017                                │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           StatefulSet: mongodb                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  MongoDB Pod (Persistent)                      │ │  │
│  │  │  - PVC: mongodb-pvc (5Gi)                      │ │  │
│  │  │  - Mount: /data/db                             │ │  │
│  │  │  - Replica: 1                                  │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         PersistentVolume (mongodb-pv)                │  │
│  │         - Type: HostPath / Cloud Storage             │  │
│  │         - Size: 5Gi                                  │  │
│  │         - Access: ReadWriteOnce                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │    HorizontalPodAutoscaler (api-hpa)                 │  │
│  │    - Min Replicas: 2                                 │  │
│  │    - Max Replicas: 10                                │  │
│  │    - CPU Target: 70%                                 │  │
│  │    - Memory Target: 80%                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │             ConfigMap (api-configmap)                │  │
│  │             - API_PORT=3000                          │  │
│  │             - NODE_ENV=production                    │  │
│  │             - CORS_ORIGIN=*                          │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │             Secret (mongodb-secret)                  │  │
│  │             - MONGODB_URI (base64 encoded)           │  │
│  │             - MONGO_ROOT_PASSWORD (base64)           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4. Kubernetes 리소스 정의

```
┌──────────────────────────────────────────────────────────────────┐
│                    namespace.yaml                                 │
└──────────────────────────────────────────────────────────────────┘

apiVersion: v1
kind: Namespace
metadata:
  name: portfolio
  labels:
    name: portfolio
    environment: production

┌──────────────────────────────────────────────────────────────────┐
│                  api-deployment.yaml                              │
└──────────────────────────────────────────────────────────────────┘

apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: portfolio
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 새 Pod를 1개까지 추가 가능
      maxUnavailable: 0   # 다운타임 없음
  selector:
    matchLabels:
      app: portfolio-api
  template:
    metadata:
      labels:
        app: portfolio-api
        version: v1
    spec:
      containers:
      - name: api
        image: ghcr.io/kgyujin/ksnu-portfolio-api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongodb-uri
        - name: API_PORT
          valueFrom:
            configMapKeyRef:
              name: api-configmap
              key: API_PORT
        resources:
          requests:
            cpu: 250m        # 최소 0.25 CPU
            memory: 256Mi    # 최소 256MB RAM
          limits:
            cpu: 500m        # 최대 0.5 CPU
            memory: 512Mi    # 최대 512MB RAM
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000

┌──────────────────────────────────────────────────────────────────┐
│                    api-service.yaml                               │
└──────────────────────────────────────────────────────────────────┘

apiVersion: v1
kind: Service
metadata:
  name: portfolio-api-service
  namespace: portfolio
spec:
  type: LoadBalancer
  selector:
    app: portfolio-api
  ports:
  - name: http
    protocol: TCP
    port: 80          # External port
    targetPort: 3000  # Container port
  sessionAffinity: ClientIP  # Sticky sessions

┌──────────────────────────────────────────────────────────────────┐
│                   mongodb-deployment.yaml                         │
└──────────────────────────────────────────────────────────────────┘

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb-deployment
  namespace: portfolio
spec:
  serviceName: mongodb-service
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:8.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
  volumeClaimTemplates:
  - metadata:
      name: mongodb-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 5Gi

┌──────────────────────────────────────────────────────────────────┐
│                      api-hpa.yaml                                 │
└──────────────────────────────────────────────────────────────────┘

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: portfolio
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50        # 50%씩 증가
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Pods
        value: 1         # 한 번에 1개씩 감소
        periodSeconds: 60

┌──────────────────────────────────────────────────────────────────┐
│                      ingress.yaml                                 │
└──────────────────────────────────────────────────────────────────┘

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  namespace: portfolio
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.portfolio.example.com
    secretName: portfolio-tls
  rules:
  - host: api.portfolio.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: portfolio-api-service
            port:
              number: 80
```

## 5. 스케일링 전략

```
┌──────────────────────────────────────────────────────────────────┐
│              Horizontal Pod Autoscaling (HPA)                     │
└──────────────────────────────────────────────────────────────────┘

Current State: 2 Pods (Normal Load)
┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │
│ CPU:40%│  │ CPU:40%│
└────────┘  └────────┘

         CPU > 70%
            │
            ▼

Scaling Up: 3 Pods (High Load)
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │
│ CPU:75%│  │ CPU:75%│  │ CPU:10%│
└────────┘  └────────┘  └────────┘
   │           │           │
   └───────────┴───────────┘
         Load Balanced

         CPU > 70% (sustained)
            │
            ▼

Scaling Up: 5 Pods (Peak Load)
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │  │ Pod 4  │  │ Pod 5  │
│ CPU:60%│  │ CPU:60%│  │ CPU:60%│  │ CPU:60%│  │ CPU:60%│
└────────┘  └────────┘  └────────┘  └────────┘  └────────┘

         CPU < 30% (5 minutes)
            │
            ▼

Scaling Down: 3 Pods (Decreased Load)
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │
│ CPU:40%│  │ CPU:40%│  │ CPU:40%│
└────────┘  └────────┘  └────────┘

         CPU < 30% (5 minutes)
            │
            ▼

Normal State: 2 Pods (Minimum Replicas)
┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │
│ CPU:25%│  │ CPU:25%│
└────────┘  └────────┘
```

## 6. 배포 전략 (Rolling Update)

```
┌──────────────────────────────────────────────────────────────────┐
│                   Rolling Update Strategy                         │
└──────────────────────────────────────────────────────────────────┘

Initial State (v1.0):
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.0│  │ Pod v1.0│  (3 replicas)
└─────────┘  └─────────┘  └─────────┘
    ▲            ▲            ▲
    └────────────┴────────────┘
         Load Balancer

Deploy v1.1 (maxSurge: 1, maxUnavailable: 0)

Step 1: Create new Pod v1.1
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.0│  │ Pod v1.0│  │ Pod v1.1│ (creating)
└─────────┘  └─────────┘  └─────────┘  └─────────┘

Step 2: New Pod ready, remove old Pod
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.0│  │ Pod v1.1│ (ready)
└─────────┘  └─────────┘  └─────────┘

Step 3: Create another new Pod
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.0│  │ Pod v1.1│  │ Pod v1.1│ (creating)
└─────────┘  └─────────┘  └─────────┘  └─────────┘

Step 4: Another old Pod removed
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.1│  │ Pod v1.1│ (ready)
└─────────┘  └─────────┘  └─────────┘

Step 5: Final new Pod creating
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.0│  │ Pod v1.1│  │ Pod v1.1│  │ Pod v1.1│ (creating)
└─────────┘  └─────────┘  └─────────┘  └─────────┘

Final State: All v1.1 (Zero Downtime!)
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Pod v1.1│  │ Pod v1.1│  │ Pod v1.1│ (all ready)
└─────────┘  └─────────┘  └─────────┘
    ▲            ▲            ▲
    └────────────┴────────────┘
         Load Balancer
```

## 7. 네트워크 정책 & 보안

```
┌──────────────────────────────────────────────────────────────────┐
│                    Kubernetes Network Policy                      │
└──────────────────────────────────────────────────────────────────┘

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: portfolio
spec:
  podSelector:
    matchLabels:
      app: portfolio-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: portfolio
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: mongodb
    ports:
    - protocol: TCP
      port: 27017
  - to:
    - podSelector:
        matchLabels:
          app: mysql
    ports:
    - protocol: TCP
      port: 3306

┌──────────────────────────────────────────────────────────────────┐
│                    Pod Security Policy                            │
└──────────────────────────────────────────────────────────────────┘

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: false
```
