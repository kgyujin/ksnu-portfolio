# Nginx 기반 정적 파일 서빙을 위한 Dockerfile
FROM nginx:alpine

# 작업 디렉터리 설정
WORKDIR /usr/share/nginx/html

# 기존 Nginx 기본 파일 제거
RUN rm -rf /usr/share/nginx/html/*

# public 디렉터리의 모든 파일을 Nginx 웹 루트로 복사
COPY public/ /usr/share/nginx/html/

# Nginx 설정 파일 복사 (커스텀 설정이 필요한 경우)
COPY nginx.conf /etc/nginx/nginx.conf

# 포트 80 노출
EXPOSE 80

# Nginx 시작 (데몬 모드 비활성화)
CMD ["nginx", "-g", "daemon off;"]
