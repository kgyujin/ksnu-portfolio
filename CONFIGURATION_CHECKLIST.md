# ⚙️ 배포 전 설정 체크리스트

## 🚨 필수 수정 항목

배포하기 전에 반드시 아래 항목들을 수정해야 합니다!

---

## 📍 1. Google Analytics 설정

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 26-30
googleAnalyticsId: 'G-XXXXXXXXXX',  // ⚠️ 여기를 변경하세요!
```

### 설정 방법
1. [Google Analytics](https://analytics.google.com/) 접속
2. **관리** → **속성 만들기**
3. 속성 이름 입력 (예: "KSNU Portfolio")
4. **데이터 스트림** → **웹** 선택
5. 웹사이트 URL과 스트림 이름 입력
6. 생성 후 **측정 ID** (G-XXXXXXXXXX 형식) 복사
7. `config.js`의 `googleAnalyticsId`에 붙여넣기

### 예시
```javascript
googleAnalyticsId: 'G-1A2B3C4D5E',  // ✅ 올바른 형식
```

---

## 📍 2. YouTube 비디오 ID 설정

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 36-47
videos: [
  {
    id: 'VIDEO_ID_1',  // ⚠️ 실제 YouTube 비디오 ID로 변경
    title: '프로젝트 소개 영상',
    containerId: 'video-container-1'
  },
  {
    id: 'VIDEO_ID_2',  // ⚠️ 실제 YouTube 비디오 ID로 변경
    title: '기술 스택 설명',
    containerId: 'video-container-2'
  }
]
```

### YouTube 비디오 ID 찾는 방법
1. YouTube에서 원하는 비디오 재생
2. 주소창의 URL 확인:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                    ↑↑↑↑↑↑↑↑↑↑↑
                                    이 부분이 Video ID
   ```
3. `v=` 뒤의 11자리 문자열 복사
4. `config.js`에 붙여넣기

### 예시
```javascript
videos: [
  {
    id: 'dQw4w9WgXcQ',  // ✅ 올바른 비디오 ID
    title: '프로젝트 데모 영상',
    containerId: 'video-container-1'
  }
]
```

### 비디오를 사용하지 않는 경우
```javascript
videos: []  // 빈 배열로 설정
```

---

## 📍 3. 사이트 URL 설정

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 72-75
url: 'https://kgyujin.github.io/ksnu-portfolio/',  // ⚠️ 실제 URL로 변경
```

### GitHub Pages 기본 URL 형식
```javascript
url: 'https://<username>.github.io/<repository-name>/'
```

### 커스텀 도메인 사용 시
```javascript
url: 'https://yourdomain.com'  // 또는
url: 'https://www.yourdomain.com'
```

### 예시
```javascript
// GitHub Pages 기본 도메인
url: 'https://kgyujin.github.io/ksnu-portfolio/'

// 커스텀 도메인
url: 'https://portfolio.dev'
```

---

## 📍 4. 백엔드 API URL 설정 (선택 사항)

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 58-61
production: {
  baseURL: 'https://your-backend-api-url.com/api'  // ⚠️ 여기를 변경하세요!
}
```

### 백엔드 서버를 배포하지 않는 경우
- 현재 상태 유지 (백엔드 기능 사용 불가)
- 방명록, 프로젝트 로딩 등의 동적 기능은 작동하지 않음

### 백엔드 서버를 배포한 경우
1. 백엔드 API 서버 URL 확인
2. `/api` 경로를 포함한 전체 URL 입력

### 예시
```javascript
// Heroku 배포 시
baseURL: 'https://ksnu-portfolio-api.herokuapp.com/api'

// AWS 배포 시
baseURL: 'https://api.yourproject.com/api'

// Vercel 배포 시
baseURL: 'https://your-api.vercel.app/api'
```

---

## 📍 5. Tawk.to 채팅 설정 (선택 사항)

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 17-19
tawkPropertyId: '57a72994c11fe69b0bd8fa90',  // 현재 예시 ID
enableChat: true,  // 채팅 기능 사용 시 true
```

### 자신의 Tawk.to Property ID 얻는 방법
1. [Tawk.to](https://www.tawk.to/) 가입/로그인
2. **Administration** → **Channels** → **Chat Widget**
3. **Direct Chat Link** 또는 코드에서 Property ID 확인
4. 코드 예시:
   ```javascript
   var Tawk_API = Tawk_API || {},
   Tawk_LoadStart = new Date();
   (function() {
     var s1 = document.createElement("script"),
     s0 = document.getElementsByTagName("script")[0];
     s1.async = true;
     s1.src = 'https://embed.tawk.to/57a72994c11fe69b0bd8fa90/default';
                                     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                     이 부분이 Property ID
   ```
5. `config.js`에 붙여넣기

### 채팅 기능을 사용하지 않는 경우
```javascript
enableChat: false,  // 채팅 위젯 비활성화
```

---

## 📍 6. Disqus 댓글 설정 (선택 사항)

### 파일 위치
```
📁 public/js/config.js
```

### 수정 내용
```javascript
// 라인: 23-24
disqusShortname: 'web1-2',  // 현재 예시 shortname
enableComments: false,  // 댓글 기능 사용 시 true로 변경
```

### 자신의 Disqus Shortname 얻는 방법
1. [Disqus](https://disqus.com/) 가입/로그인
2. **Admin** → **Settings** → **General**
3. **Shortname** 확인 (URL에서도 확인 가능)
   ```
   https://disqus.com/admin/YOUR_SHORTNAME/
                            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                            이 부분이 Shortname
   ```
4. `config.js`에 입력

### 댓글 기능 활성화
```javascript
disqusShortname: 'your-shortname',
enableComments: true,  // ✅ true로 변경
```

### 댓글 기능을 사용하지 않는 경우
```javascript
enableComments: false,  // 현재 상태 유지
```

---

## 📋 수정 전 체크리스트

배포하기 전에 체크하세요:

### 필수 항목
- [ ] Google Analytics ID 변경 완료
- [ ] 사이트 URL이 올바른지 확인
- [ ] YouTube 비디오 ID 설정 (비디오 사용 시)

### 선택 항목
- [ ] 백엔드 API URL 설정 (백엔드 배포 시)
- [ ] Tawk.to Property ID 확인 (채팅 사용 시)
- [ ] Disqus Shortname 설정 (댓글 사용 시)

### 확인 사항
- [ ] `config.js` 파일 저장 완료
- [ ] Git에 변경사항 커밋 및 푸시
- [ ] GitHub Actions 워크플로우 실행 확인

---

## 🔍 설정 값 위치 요약표

| 항목 | 파일 경로 | 라인 | 변수명 | 필수 여부 |
|------|----------|------|--------|----------|
| Google Analytics | `public/js/config.js` | 30 | `googleAnalyticsId` | ✅ 필수 |
| YouTube Video 1 | `public/js/config.js` | 38 | `videos[0].id` | ⚠️ 선택 |
| YouTube Video 2 | `public/js/config.js` | 43 | `videos[1].id` | ⚠️ 선택 |
| 사이트 URL | `public/js/config.js` | 74 | `site.url` | ✅ 필수 |
| API URL | `public/js/config.js` | 60 | `api.production.baseURL` | ⚠️ 선택 |
| Tawk.to ID | `public/js/config.js` | 18 | `tawkPropertyId` | ⚠️ 선택 |
| Disqus Name | `public/js/config.js` | 23 | `disqusShortname` | ⚠️ 선택 |

---

## 🛠️ 빠른 수정 가이드

### VS Code에서 파일 열기
```bash
code public/js/config.js
```

### 또는 터미널에서 직접 편집
```bash
nano public/js/config.js
# 또는
vim public/js/config.js
```

### 수정 후 배포
```bash
git add public/js/config.js
git commit -m "Update production configuration"
git push origin main
```

---

## 📞 도움이 필요하신가요?

### 참고 문서
- [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - GitHub Pages 호스팅 가이드
- [README_MODULAR.md](./README_MODULAR.md) - 프로젝트 전체 구조

### 설정 관련 문서
- [Google Analytics 시작 가이드](https://support.google.com/analytics/answer/9304153)
- [Tawk.to 설정 가이드](https://help.tawk.to/article/direct-chat-link)
- [Disqus 설정 가이드](https://help.disqus.com/en/articles/1717111-what-s-a-shortname)

---

**💡 팁**: 모든 설정을 한 번에 수정하지 말고, 하나씩 수정하며 테스트하세요!
