# 🔌 MongoDB Data API 설정 가이드

Railway 없이 **GitHub Variables만으로** MongoDB Atlas에 직접 연결하는 방법입니다.

## 📋 준비물
- MongoDB Atlas 계정 (무료)
- GitHub Repository (현재 저장소)

---

## 🚀 1단계: MongoDB Atlas Data API 활성화

### 1. MongoDB Atlas 로그인
https://cloud.mongodb.com/

### 2. Data API 활성화
1. 좌측 메뉴 **App Services** 클릭
2. **Create a New App** 클릭
3. App 이름: `portfolio-data-api`
4. Cluster 선택: `ksnu-portfolio-cluster`
5. **Create App Service** 클릭

### 3. Data API 설정
1. 좌측 메뉴 **HTTPS Endpoints** → **Data API** 클릭
2. **Enable** 버튼 클릭
3. **Data API Access** 활성화

### 4. API Key 생성
1. **Authentication** 탭으로 이동
2. **API Keys** 선택
3. **Create API Key** 클릭
4. Key Name: `github-pages-access`
5. **Generate Key** 클릭
6. 🔐 **API Key 복사 (절대 잃어버리지 마세요!)**

### 5. 필요한 정보 확인

**Data API URL:**
```
https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1
```
→ App Services → Settings → Application ID에서 확인

**Data Source Name:**
```
ksnu-portfolio-cluster
```
→ Data API 페이지에서 확인

---

## 🔐 2단계: GitHub Secrets & Variables 설정

### 1. GitHub Repository → Settings

### 2. Secrets and variables → Actions

### 3. **Secrets** 탭에서 추가
```
Name: MONGODB_DATA_API_KEY
Value: (위에서 복사한 API Key)
```
⚠️ **Secret으로 저장** (공개되면 안 됨!)

### 4. **Variables** 탭에서 추가
```
Name: MONGODB_DATA_API_URL
Value: https://data.mongodb-api.com/app/ksnu-portfoilo/endpoint/data/v1

Name: MONGODB_DATA_SOURCE
Value: ksnu-portfolio-cluster

Name: MONGODB_DATABASE
Value: portfolio
```

---

## 🎯 3단계: 코드 커밋 & 배포

### 1. 현재 변경사항 커밋
```bash
git add .
git commit -m "feat: Add MongoDB Data API support for GitHub Pages"
git push origin main
```

### 2. GitHub Actions 확인
- GitHub Repository → Actions 탭
- 워크플로우 실행 확인
- 환경변수가 주입되는지 로그 확인

### 3. 배포 완료 후 테스트
```
https://kgyujin.github.io/ksnu-portfolio/
```

---

## ✅ 4단계: 작동 확인

### 로컬 (localhost:8080)
```
✅ Docker 백엔드 API 사용
✅ MongoDB Atlas 연결
✅ 댓글 작성/삭제 가능
```

### GitHub Pages (kgyujin.github.io)
```
✅ MongoDB Data API 직접 사용
✅ MongoDB Atlas 연결
✅ 댓글 작성/삭제 가능
🎉 Railway 필요 없음!
```

---

## 🔒 보안 주의사항

### ⚠️ API Key 노출 문제

**문제점:**
- API Key가 `config.js`에 포함되어 브라우저에 노출됨
- 누구나 개발자 도구로 확인 가능
- 악의적 사용 가능성

**해결방법:**

#### 1. MongoDB Atlas에서 IP 화이트리스트 설정
1. Atlas → Network Access
2. **Add IP Address**
3. `0.0.0.0/0` (모든 IP 허용) 대신
4. CloudFlare IP 범위만 허용 (GitHub Pages는 CloudFlare 사용)

#### 2. Data API 접근 규칙 설정
1. App Services → Rules
2. `comments` 컬렉션 규칙 설정:
```json
{
  "read": true,
  "write": {
    "%%true": {
      "isApproved": true,
      "isDeleted": false
    }
  },
  "delete": false
}
```

#### 3. Rate Limiting
MongoDB Atlas는 자동으로 Rate Limiting 적용됨

---

## 🆚 비교: Railway vs Data API

| 항목 | Railway (백엔드) | Data API (직접) |
|------|-----------------|----------------|
| 서버 필요 | ✅ 필요 | ❌ 불필요 |
| 비용 | 무료 (500시간/월) | 완전 무료 |
| 보안 | ✅ 서버에서 처리 | ⚠️ 브라우저 노출 |
| 복잡한 로직 | ✅ 가능 | ❌ 제한적 |
| 설정 난이도 | 중간 | 쉬움 |

---

## 🐛 문제 해결

### API Key가 작동하지 않음
```bash
# GitHub Actions 로그 확인
GitHub Repository → Actions → 최신 워크플로우 → 로그 확인
```

### 댓글이 저장되지 않음
1. MongoDB Atlas → App Services → Logs 확인
2. Data API 권한 설정 확인
3. 브라우저 콘솔에서 에러 확인 (F12)

### CORS 에러 발생
MongoDB Data API는 기본적으로 CORS를 허용하므로 발생하지 않아야 함.
발생 시 App Services → HTTPS Endpoints → Configuration 확인

---

## 📝 완료 체크리스트

- [ ] MongoDB Atlas Data API 활성화
- [ ] API Key 생성 및 복사
- [ ] GitHub Secrets에 API_KEY 추가
- [ ] GitHub Variables에 URL, DataSource, Database 추가
- [ ] 코드 커밋 & 푸시
- [ ] GitHub Actions 워크플로우 성공 확인
- [ ] GitHub Pages에서 댓글 작성 테스트
- [ ] 댓글 삭제 테스트

---

**설정 완료 후:** https://kgyujin.github.io/ksnu-portfolio/ 에서 댓글 기능이 작동합니다! 🎉
