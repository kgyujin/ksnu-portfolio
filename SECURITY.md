# 🔒 보안 주의사항

## ⚠️ 중요: 민감한 정보 관리

이 프로젝트는 MongoDB Atlas를 사용하며, **데이터베이스 연결 정보가 포함된 파일은 절대 Git에 커밋되지 않습니다.**

### 🚫 Git에 커밋하지 않는 파일들

다음 파일들은 `.gitignore`에 포함되어 있어 Git에 업로드되지 않습니다:

```
.env                          # ❌ MongoDB 연결 문자열 포함
backend/.env                  # ❌ 백엔드 환경변수
docker-compose.override.yml   # ❌ 로컬 Docker 설정
```

### ✅ Git에 포함된 안전한 파일들

```
.env.example                  # ✅ 템플릿만 (실제 값 없음)
backend/.env.example          # ✅ 템플릿만
docker-compose.yml            # ✅ 환경변수 참조만 (${MONGODB_URI})
```

---

## 🔐 현재 보안 상태

### ✅ 구현된 보안 조치

1. **환경변수 관리**
   - `.env` 파일은 `.gitignore`에 포함
   - `docker-compose.yml`은 환경변수만 참조 (`${MONGODB_URI}`)
   - 실제 값은 로컬에만 존재

2. **비밀번호 보안**
   - SHA-256 해시 사용
   - 평문 비밀번호 저장 안 함
   - 삭제 시 비밀번호 재확인

3. **XSS 방지**
   - HTML 엔티티 인코딩
   - 위험한 패턴 차단 (<script>, <iframe> 등)
   - textContent 사용 (innerHTML 미사용)

4. **MongoDB 인젝션 방지**
   - Mongoose 스키마 검증
   - 입력값 새니타이즈
   - 파라미터화된 쿼리 사용

---

## 📋 로컬 개발자를 위한 체크리스트

새로 프로젝트를 클론한 경우:

- [ ] `.env.example`을 복사하여 `.env` 생성
- [ ] MongoDB Atlas 연결 문자열 입력
- [ ] `.env` 파일이 `.gitignore`에 있는지 확인
- [ ] `git status`로 `.env`가 추적되지 않는지 확인
- [ ] Docker 실행 및 연결 테스트

```bash
# 1. 환경변수 파일 생성
cp .env.example .env

# 2. .env 파일 편집 (MongoDB 연결 정보 입력)
nano .env

# 3. Git에 추적되지 않는지 확인
git status | grep .env
# 출력 없으면 정상 (ignored 상태)

# 4. Docker 실행
docker compose up -d

# 5. 로그 확인
docker logs portfolio-api
```

---

## 🌐 GitHub Pages 배포 시 보안

### 현재 설정
- **프론트엔드**: 정적 파일만 배포 (HTML, CSS, JS)
- **백엔드 API**: GitHub Pages에 포함되지 않음
- **데이터베이스**: MongoDB Atlas (별도 클라우드)

### 프론트엔드에서의 환경 감지

```javascript
// public/js/config.js
get isProduction() {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
}
```

- **로컬**: `localhost` → API 사용 → MongoDB Atlas 연결 ✅
- **GitHub Pages**: `kgyujin.github.io` → 정적 데이터 사용 (API 미사용)

---

## 🚨 만약 .env를 실수로 커밋했다면?

### 즉시 조치사항

1. **GitHub에서 파일 삭제**
```bash
# 파일을 Git 히스토리에서 완전히 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 강제 푸시
git push origin --force --all
```

2. **MongoDB 비밀번호 즉시 변경**
   - MongoDB Atlas → Database Access
   - 사용자 비밀번호 재설정
   - 새 연결 문자열로 `.env` 업데이트

3. **새 연결 문자열로 재배포**
```bash
# .env 파일 업데이트 후
docker compose down
docker compose up -d --build
```

---

## 📞 문의

보안 관련 문제 발견 시:
- GitHub Issues에 **절대 비밀번호나 연결 문자열을 포함하지 마세요**
- 일반적인 문제 설명만 작성
- 민감한 정보는 DM이나 이메일로 전달

---

**작성일:** 2025-11-18  
**최종 업데이트:** MongoDB Atlas 전환 완료
