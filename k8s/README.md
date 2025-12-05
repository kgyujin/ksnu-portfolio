# Kubernetes 배포 가이드

## 개요
본 프로젝트는 Kubernetes를 사용하여 컨테이너 오케스트레이션을 구현합니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                   Ingress Controller                 │
│            (api.portfolio.example.com)              │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              LoadBalancer Service                    │
│            (portfolio-api-service)                  │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌──────────────┐           ┌──────────────┐
│   API Pod 1  │           │   API Pod 2  │
│  (Node.js)   │           │  (Node.js)   │
└──────┬───────┘           └──────┬───────┘
       │                          │
       └──────────┬───────────────┘
                  ▼
         ┌─────────────────┐
         │ ClusterIP Service│
         │ (mongodb-service)│
         └────────┬─────────┘
                  ▼
         ┌─────────────────┐
         │  MongoDB Pod    │
         │  (StatefulSet)  │
         └────────┬─────────┘
                  ▼
         ┌─────────────────┐
         │ PersistentVolume│
         │     (5Gi)       │
         └─────────────────┘
```

## 구성 요소

### 1. Namespace
- **파일**: `namespace.yaml`
- **설명**: 리소스 격리를 위한 논리적 분리

### 2. MongoDB (StatefulSet)
- **파일**: 
  - `mongodb-deployment.yaml` - StatefulSet 정의
  - `mongodb-service.yaml` - 내부 서비스
  - `mongodb-pvc.yaml` - 영구 볼륨 클레임
  - `mongodb-secret.yaml` - 접속 정보
- **설명**: 상태 유지가 필요한 데이터베이스 (5Gi 영구 스토리지)

### 3. Backend API (Deployment)
- **파일**:
  - `api-deployment.yaml` - 2개 복제본으로 실행
  - `api-service.yaml` - LoadBalancer 서비스
  - `api-configmap.yaml` - 환경 설정
  - `api-hpa.yaml` - 자동 스케일링 (2~10개 Pod)
- **설명**: Node.js Express API 서버

### 4. Ingress
- **파일**: `ingress.yaml`
- **설명**: 외부 트래픽 라우팅, CORS, Rate Limiting

## 배포 순서

### 1단계: Namespace 생성
```bash
kubectl apply -f k8s/namespace.yaml
```

### 2단계: ConfigMap 및 Secret 생성
```bash
kubectl apply -f k8s/mongodb-secret.yaml
kubectl apply -f k8s/api-configmap.yaml
```

### 3단계: MongoDB 배포
```bash
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
```

### 4단계: API 서버 배포
```bash
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/api-service.yaml
kubectl apply -f k8s/api-hpa.yaml
```

### 5단계: Ingress 설정 (선택사항)
```bash
# Nginx Ingress Controller 설치 필요
kubectl apply -f k8s/ingress.yaml
```

### 전체 배포 (한 번에)
```bash
kubectl apply -f k8s/
```

## 확인 명령어

### 리소스 상태 확인
```bash
# 모든 리소스 확인
kubectl get all -n portfolio

# Pod 상태 확인
kubectl get pods -n portfolio

# 서비스 확인
kubectl get services -n portfolio

# Ingress 확인
kubectl get ingress -n portfolio

# HPA 상태 확인
kubectl get hpa -n portfolio
```

### 로그 확인
```bash
# API Pod 로그
kubectl logs -f -l app=portfolio-api -n portfolio

# MongoDB Pod 로그
kubectl logs -f -l app=mongodb -n portfolio
```

### 세부 정보 확인
```bash
# Pod 상세 정보
kubectl describe pod <pod-name> -n portfolio

# Service 상세 정보
kubectl describe service portfolio-api-service -n portfolio

# HPA 상세 정보
kubectl describe hpa portfolio-api-hpa -n portfolio
```

## 스케일링

### 수동 스케일링
```bash
# API Pod 수 조정
kubectl scale deployment portfolio-api --replicas=5 -n portfolio
```

### 자동 스케일링 (HPA)
- CPU 사용률 70% 이상 시 자동 증가
- Memory 사용률 80% 이상 시 자동 증가
- 최소 2개 ~ 최대 10개 Pod

## 업데이트 전략

### Rolling Update
```bash
# 새로운 이미지로 업데이트
kubectl set image deployment/portfolio-api \
  api=ghcr.io/kgyujin/ksnu-portfolio-api:v2.0 \
  -n portfolio

# 롤백
kubectl rollout undo deployment/portfolio-api -n portfolio

# 업데이트 상태 확인
kubectl rollout status deployment/portfolio-api -n portfolio
```

## 트러블슈팅

### Pod가 시작되지 않을 때
```bash
# 이벤트 확인
kubectl get events -n portfolio --sort-by='.lastTimestamp'

# Pod 상세 정보
kubectl describe pod <pod-name> -n portfolio

# 로그 확인
kubectl logs <pod-name> -n portfolio
```

### MongoDB 연결 실패 시
```bash
# MongoDB Pod 접속
kubectl exec -it mongodb-0 -n portfolio -- mongosh

# 연결 테스트
kubectl run test-mongodb --rm -it --image=mongo:8.0 -n portfolio -- \
  mongosh "mongodb://portfolio-user:ChangeThisPassword@mongodb-service:27017/portfolio?authSource=admin"
```

### Service 연결 확인
```bash
# 서비스 엔드포인트 확인
kubectl get endpoints -n portfolio

# 서비스 테스트
kubectl run test-curl --rm -it --image=curlimages/curl -n portfolio -- \
  curl http://portfolio-api-service/health
```

## 삭제

### 전체 삭제
```bash
kubectl delete namespace portfolio
```

### 개별 리소스 삭제
```bash
kubectl delete -f k8s/api-deployment.yaml
kubectl delete -f k8s/mongodb-deployment.yaml
```

## 프로덕션 체크리스트

- [ ] Secret 값을 안전한 값으로 변경
- [ ] Ingress 도메인 설정
- [ ] TLS/SSL 인증서 설정
- [ ] 리소스 제한(requests/limits) 조정
- [ ] Persistent Volume 백업 설정
- [ ] 모니터링 설정 (Prometheus, Grafana)
- [ ] 로깅 설정 (ELK Stack)
- [ ] Network Policy 설정
- [ ] RBAC 권한 설정
- [ ] 이미지 레지스트리 보안 설정

## 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Kubectl 치트시트](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Helm Charts](https://helm.sh/)
- [Kustomize](https://kustomize.io/)
