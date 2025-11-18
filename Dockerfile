# Railway 배포용 Dockerfile (루트 디렉토리에서 빌드)
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# backend 디렉토리의 package.json 복사
COPY backend/package*.json ./

# 의존성 설치
RUN npm ci --omit=dev

# backend 소스 코드 복사
COPY backend/src/ ./src/

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 서버 시작
CMD ["node", "src/server.js"]
