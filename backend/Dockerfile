# Node.js 백엔드 API 서버용 Dockerfile
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (npm install을 사용하여 lock 파일 불일치 문제 방지)
RUN npm install --omit=dev && npm cache clean --force

# 소스 코드 복사
COPY src/ ./src/

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 서버 시작
CMD ["node", "src/server.js"]
