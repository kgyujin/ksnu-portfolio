# 🌐 GitHub Pages 호스팅 가이드

## 📋 목차
1. [GitHub Pages 활성화](#1-github-pages-활성화)
2. [자동 배포 설정](#2-자동-배포-설정)
3. [커스텀 도메인 연결](#3-커스텀-도메인-연결)
4. [필수 설정 변경](#4-필수-설정-변경)
5. [배포 확인](#5-배포-확인)

---

## 1. GitHub Pages 활성화

### Step 1: GitHub 저장소 설정
1. GitHub 저장소 페이지로 이동
2. **Settings** → **Pages** 메뉴 클릭
3. **Source** 섹션에서:
   - Source: `GitHub Actions` 선택 (권장)
   - 또는 Branch: `main` 선택, Folder: `/public` 선택

### Step 2: 배포 확인
- Actions 탭에서 배포 진행 상황 확인
- 배포 완료 후 제공되는 URL 확인:
  ```
  https://<username>.github.io/<repository-name>/
  ```

---

## 2. 자동 배포 설정

### 이미 설정 완료! ✅
프로젝트에 `.github/workflows/deploy-gh-pages.yml` 파일이 생성되어 있습니다.

### 작동 방식
- `main` 브랜치에 코드 푸시 → 자동으로 GitHub Pages에 배포
- `public/` 폴더의 내용만 배포됨
- Actions 탭에서 배포 로그 확인 가능

### 수동 배포
GitHub 웹사이트에서:
1. **Actions** 탭 클릭
2. **Deploy to GitHub Pages** 워크플로우 선택
3. **Run workflow** 버튼 클릭

---

## 3. 커스텀 도메인 연결

### 3.1 도메인 구매
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [가비아](https://www.gabia.com/) (한국)

### 3.2 DNS 설정

#### 방법 A: Apex 도메인 (예: example.com)
도메인 제공업체의 DNS 설정에서:

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

#### 방법 B: Subdomain (예: www.example.com)
```
Type     Name    Value
CNAME    www     <username>.github.io
```

### 3.3 GitHub에 도메인 설정
1. GitHub 저장소 → **Settings** → **Pages**
2. **Custom domain**에 도메인 입력:
   - Apex: `example.com`
   - Subdomain: `www.example.com`
3. **Save** 클릭
4. **Enforce HTTPS** 체크 (DNS 전파 후 가능)

### 3.4 CNAME 파일 생성 (자동)
GitHub가 자동으로 생성하지만, 수동으로 생성하려면:

```bash
echo "yourdomain.com" > public/CNAME
git add public/CNAME
git commit -m "Add CNAME for custom domain"
git push
```

### 3.5 DNS 전파 확인
DNS 전파는 최대 48시간 소요될 수 있습니다.
확인 도구:
- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## 4. 필수 설정 변경

### 4.1 `public/js/config.js` 수정

```javascript
// Google Analytics ID 변경
googleAnalyticsId: 'G-XXXXXXXXXX'  // ⚠️ 실제 GA4 측정 ID로 변경

// YouTube Video IDs 변경
videos: [
  {
    id: 'dQw4w9WgXcQ',  // ⚠️ 실제 비디오 ID로 변경
    title: '프로젝트 소개 영상',
    containerId: 'video-container-1'
  }
]

// 사이트 URL 변경
url: 'https://yourdomain.com'  // ⚠️ 실제 도메인으로 변경
```

### 4.2 Google Analytics 설정
1. [Google Analytics](https://analytics.google.com/) 접속
2. 새 속성 만들기
3. 데이터 스트림 → 웹 → URL 입력
4. 측정 ID (G-XXXXXXXXXX) 복사
5. `config.js`에 붙여넣기

### 4.3 YouTube 비디오 ID 찾기
YouTube URL에서 `v=` 뒤의 값:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                 ↑ 이 부분이 Video ID
```

---

## 5. 배포 확인

### 5.1 로컬 테스트
```bash
# 간단한 HTTP 서버 실행
cd public
python3 -m http.server 8000

# 또는 npx 사용
npx serve public
```

브라우저에서 `http://localhost:8000` 접속

### 5.2 배포 후 확인 사항
- ✅ 모든 페이지가 정상적으로 로드되는지
- ✅ Tawk.to 채팅 위젯이 우측 하단에 표시되는지
- ✅ Google Analytics가 작동하는지 (실시간 보고서 확인)
- ✅ 이미지와 CSS가 제대로 로드되는지
- ✅ 콘솔에 에러가 없는지

### 5.3 문제 해결

#### 404 에러 발생
- `config.js`의 `site.url`이 올바른지 확인
- GitHub Pages가 활성화되어 있는지 확인

#### CSS/JS 파일 로드 실패
- 경로가 절대 경로로 되어 있는지 확인
- 브라우저 캐시 삭제 후 재시도

#### Google Analytics 작동 안 함
- 측정 ID가 올바른지 확인
- 브라우저의 광고 차단기 비활성화
- 실시간 보고서에서 15분 후 확인

---

## 📚 추가 리소스

### GitHub Pages 공식 문서
- [GitHub Pages 기본 가이드](https://docs.github.com/en/pages)
- [커스텀 도메인 설정](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [HTTPS 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

### 도움되는 도구
- [GitHub Pages 상태 확인](https://www.githubstatus.com/)
- [DNS 전파 확인](https://dnschecker.org/)
- [SSL 인증서 확인](https://www.ssllabs.com/ssltest/)

---

## 🚨 중요 체크리스트

배포 전 반드시 확인하세요:

- [ ] `config.js`의 Google Analytics ID 변경
- [ ] `config.js`의 사이트 URL 변경
- [ ] YouTube Video IDs 변경 (비디오 사용 시)
- [ ] 백엔드 API URL 설정 (API 사용 시)
- [ ] GitHub Actions 워크플로우 확인
- [ ] DNS 설정 완료 (커스텀 도메인 사용 시)
- [ ] HTTPS 활성화 확인

---

## 💡 팁

### 빠른 배포를 위한 명령어
```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "Update configuration for production"
git push origin main

# 배포 상태 확인
# GitHub 저장소 → Actions 탭에서 확인
```

### 개발 vs 프로덕션 환경
프로젝트는 자동으로 환경을 감지합니다:
- 로컬 개발: `localhost` 감지 → 개발 모드
- GitHub Pages: 도메인 감지 → 프로덕션 모드

`config.js`에서 환경별 설정이 자동으로 적용됩니다.

---

**문제가 발생하면 `CONFIGURATION_CHECKLIST.md`를 확인하세요!**
