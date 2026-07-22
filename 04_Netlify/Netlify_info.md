# Netlify 학습 로드맵

배포 개념 · 드래그&드롭 배포 · GitHub 연동 자동 배포

---

## 1. Netlify란? — 배포 개념

- `localhost`로 연 페이지는 내 컴퓨터에서만 접속 가능
- **배포** = 내가 만든 파일을 인터넷 서버에 올려 누구나 접속하는 URL 받기
- **Netlify** = 완성된 HTML·CSS 파일을 그대로 올리는 호스팅

### 왜 Netlify인가

- **가장 쉬움** — 파일 폴더를 드래그&드롭만 하면 끝
- **무료** — 학습·포트폴리오 용도 충분
- **빠른 성취** — HTML·CSS만 있으면 바로 인터넷 공개
- **Git 선택** — 드래그 배포는 Git 없이도 가능

---

## 2. 드래그&드롭 배포 — 가장 쉬운 방법

Git 없이 파일 폴더를 끌어다 놓기만으로 배포.
HTML·CSS로 만든 결과물을 1분 안에 인터넷에 공개.

### 준비물

```
my-site/
├── index.html   ← 시작 페이지 (이름 필수)
└── style.css    ← 스타일 파일
```

### 배포 단계

1. [app.netlify.com](https://app.netlify.com) 접속 (무료 가입)
2. Sites 화면의 **Drag and drop** 영역 찾기
3. `my-site` 폴더를 통째로 끌어다 놓기
4. 자동 업로드 → 공개 URL 발급
   → `https://random-name-123.netlify.app`
5. Site settings → 이름 변경으로 URL 정리 가능

### 실제 화면 — Production deploys

Netlify Production deploys — 프로젝트 폴더를 끌어다 놓는 드래그&드롭 영역

- 시작 파일 이름은 반드시 `index.html`
- 수정하면 폴더를 다시 드래그&드롭 → 새 버전 반영

---

## 3. GitHub 연동 자동 배포 — 한 단계 위

드래그&드롭은 수정할 때마다 다시 올려야 함.
GitHub 저장소 연결 = `git push`만 하면 자동 재배포.

### ① GitHub에 올리기

```bash
git init
git add .
git commit -m "first deploy"
git branch -M main
git remote add origin https://github.com/내아이디/my-site.git
git push -u origin main
```

### ② Netlify에서 저장소 연결

```
app.netlify.com → Add new site → Import an existing project
→ GitHub 선택 → my-site 저장소 연결
→ (정적 HTML·CSS면 빌드 설정 비워두고) Deploy
→ 공개 URL 발급
```

- 이후 `git push`만 하면 Netlify가 알아서 재배포
- 코드 수정 → push → 몇 초 뒤 사이트 자동 갱신 (CI/CD 체험)

---

## 4. 사이트 관리·배포 철회 — 삭제 순서

배포한 사이트 내리기 = Danger zone에서 처리.
아래 순서대로 따라가면 안전하게 철회 가능.

### ① 배포 상태 확인

Deploys 탭에서 **Production · Published** 표시 = 현재 공개 중

> Netlify Deploys — Production Published 상태 표시

### ② 배포 상세 · 옵션 열기

배포 클릭 → **Lock to stop auto publishing** = 자동 배포 중단
Options → Download deployed files · Deploy settings

> Netlify Published deploy — Lock to stop auto publishing · Options 메뉴

### ③ 사이트 Configuration 진입

Site → Configuration → 좌측 General 메뉴 맨 아래 **Danger zone** 클릭

> Netlify Configuration 화면 — General 메뉴 하단 Danger zone

### ④ 비활성화 또는 영구 삭제

- **Disable project** = 임시로 사이트 내림 (언제든 재활성화)
- **Delete this project** = 사이트 + URL 영구 삭제 (되돌릴 수 없음)

> Netlify Danger zone — Disable project · Delete this project 버튼

---

## 5. 커스텀 도메인·HTTPS — 주소 바꾸기

기본 주소 `iridescent-halva-e95c8e.netlify.app` → 보기 좋게 변경.
서브도메인 이름만 바꾸거나, 내 도메인 연결 둘 다 가능.

### 실제 화면 — Production domains

> Netlify Production domains — Add a domain · Options · Edit project name 메뉴

### ① 서브도메인 이름만 변경 (무료)

```
Domain management → Production domains
→ Options → Edit project name
→ 원하는 이름 입력 → my-site.netlify.app
```

### ② 내 도메인 연결

```
Add a domain → 보유 도메인 입력 (예: mysite.com)
→ DNS 설정 (Netlify DNS 또는 외부 CNAME)
→ 연결 완료 → 내 주소로 접속
```

- HTTPS = 무료 자동 (Let's Encrypt, 설정 불필요)
- 도메인 구매는 별도 (가비아·Cloudflare 등)
