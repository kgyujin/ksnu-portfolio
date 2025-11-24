# KSNU-webPortfolio
객체지향S/W 개발 프로젝트 과제로 제작한 웹 포트폴리오입니다.

## 소개
- 자기 소개
- 학력 및 경력사항  
- 기술 스택과 사용 가능한 도구 목록
- 프로젝트 갤러리
- 댓글 작성 기능
- 실시간 채팅 지원 (Tawk.to)

## 적용 방법
### 요구 사항
- 최신 버전의 웹 브라우저
- 로컬 개발: Docker, Docker Compose

### 온라인 접속
프로젝트는 GitHub Pages에 배포되어 있습니다:
```
https://kgyujin.github.io/ksnu-portfolio/
```

### 로컬 설치 방법
1. 이 저장소를 클론합니다.
   ```sh
   git clone https://github.com/kgyujin/ksnu-portfolio.git
   ```
2. 프로젝트 디렉토리로 이동합니다.
   ```sh
   cd ksnu-portfolio
   ```
3. 환경 변수를 설정합니다.
   ```sh
   cp .env.example .env
   # .env 파일에서 MongoDB Atlas 연결 정보 입력
   ```
4. Docker Compose로 실행합니다.
   ```sh
   docker compose up -d
   ```
5. 브라우저에서 `http://localhost:3000`으로 접속합니다.

### 간단한 실행 (정적 파일만)
Docker 없이 정적 파일만 확인하려면:
```sh
cd public
python3 -m http.server 8080
```
브라우저에서 `http://localhost:8080`으로 접속합니다.

## 주의사항
- 사용중인 브라우저의 '하드웨어 가속화'가 비활성화라면 활성화로 변경해주세요.  
  세부 프로젝트 내용 확인 시 사이트가 느려질 수 있습니다.