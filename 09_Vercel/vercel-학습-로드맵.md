# Vercel 학습 로드맵

홈페이지 업로드 -> CLI 배포 -> GitHub 연동 -> Claude 연동

---

## 1. 홈페이지 업로드 (Vercel Drop)

브라우저에 끌어다 놓기만. Git, CLI, 설치 전부 없이 vercel.com/drop에 파일, 폴더, .zip 드래그.
적합: 프로토타입, 정적 사이트, 일회성 배포.

### 배포 순서 - 클릭 4번

1. vercel.com/drop 접속
2. 파일, 폴더, .zip 드래그 (또는 파일/폴더 선택)
3. 팀 선택 + 프로젝트 이름 입력
4. Deploy 클릭 -> production URL 즉시 발급

- 정적 사이트 = 빌드 없이 그대로 게시
- 프레임워크 프로젝트 = Vercel이 자동 감지, 빌드

### index.html 없을 때

- 최상위에 index.html 없으면 첫 화면 페이지를 물음 -> Root (/) 메뉴에서 선택
- No root page 선택 시 루트(/)는 404, 각 파일은 자기 경로로 접속

### 배포 방법 3가지 비교

- Vercel Drop - 브라우저에 드래그. Git도 CLI도 필요 없음. 일회성, 정적 사이트, 프로토타입에 적합.
- Git 연동 - GitHub 저장소를 붙여둠. push할 때마다 자동 배포. 실무 표준.
- CLI - 터미널에서 `vercel` 명령. 로컬에서 바로 올리거나 CI, 스크립트에 쓸 때.

### 한계

- 드롭마다 새 프로젝트 생성 -> 기존 프로젝트 재배포 불가
- Git 미연결 -> push해도 자동 배포 안 됨 (나중에 Git 연결 가능)
- 큰 폴더는 브라우저 업로드라 느림

### 이미 Drop으로 올린 사이트 업데이트

Vercel Drop엔 기존 프로젝트에 새 파일 드롭하는 기능 없음 (Netlify와 다름). 드래그앤드롭은 매번 새 프로젝트.
같은 URL로 갱신하려면 셋 중 하나:

- 또 드롭 -> 안 됨. 새 프로젝트, 새 URL 생김.
- CLI `vercel --prod` -> 같은 URL 유지. 가장 빠름 (2번 참고).
- Git 연결 -> 같은 URL 유지. push하면 자동배포 (3번 참고).

### Drop 프로젝트에 GitHub 나중에 연결

```
대시보드 -> 프로젝트 -> Settings -> Git
-> Connect Git Repository -> 저장소 선택
연결 후 push -> 자동 재배포 (URL 그대로)
```

### Production 브랜치 바꾸기

연결한 브랜치와 production 브랜치가 다르면 배포 안 됨 (기본값 main).

```
대시보드 -> Settings -> Environments -> Production
-> Branch Tracking -> "Branch is [main]" 클릭
-> 원하는 브랜치 선택 -> 저장
(구버전 UI는 Settings -> Git 상단에 Production Branch)
```

또는 작업 브랜치를 main에 머지해서 push (설정 안 건드림).

### 대시보드에서 수동 재배포

코드 변경 없이 다시 빌드만: Deployments 탭 -> 최신 배포 ... -> Redeploy.
코드 수정분 반영하려면 먼저 push 필요 (Redeploy는 그 커밋 그대로 재빌드).

### 핵심 포인트

- Vercel Drop = 일회성. 드롭마다 새 프로젝트 -> 기존 사이트 업데이트 불가
- 같은 URL 업데이트 -> CLI `vercel --prod` 또는 Git 연결 필수
- Git 연결 = Settings -> Git -> Connect Repository
- 배포 브랜치 변경 = Settings -> Environments -> Production -> Branch Tracking (기본 main)
- 자동배포 조건 = production 브랜치에 push (브랜치 불일치 시 배포 안 됨)
- 수동 재배포 = Deployments -> ... -> Redeploy (수정분은 push 먼저)

---

## 2. CLI 배포

배포 = 내 코드를 인터넷 서버에 올려 누구나 접속하는 URL 받기.
가장 빠른 길 = Vercel CLI, 터미널 4줄.

### 어디서 실행? - 프로젝트 폴더 안에서

```bash
cd my-app             # 프로젝트 루트로 이동 (package.json 있는 곳)
ls                    # package.json 보이면 위치 맞음
vercel                # 이 위치에서 실행 -> 현재 폴더가 배포 대상
```

- `vercel`은 실행한 현재 디렉토리를 배포 대상으로 잡음 -> 폴더 밖에서 실행하면 엉뚱한 폴더 올라감
- 첫 실행 `? Code directory?` -> `./` = "현재 폴더" -> 현재 위치가 프로젝트 루트여야 함

### 설치, 로그인, 배포

배포하려는 프로젝트 폴더 안에서 실행할 것 (`cd my-app` 후 package.json 있는 위치).

```bash
npm i -g vercel       # CLI 설치 (최초 1회)
vercel login          # 브라우저 인증 (1회)
vercel                # preview 배포 - 임시 URL
vercel --prod         # production 배포 - 실서비스 URL
```

- `vercel` = preview (매번 새 임시 URL, 실서비스 영향 없음)
- `vercel --prod` = production (실서비스 도메인 갱신)
- 첫 배포는 production이 없어 자동 승격
- 오타 주의 - `--pord`(X), `--prod`(O)

### vercel 첫 실행 시 묻는 것

```
? Set up and deploy?   -> y
? Project name?        -> my-app
? Code directory?      -> ./
Detected Vite          -> 빌드 설정 자동 감지 (vite build, dist)
? Customize settings?  -> no
```

---

## 3. GitHub 연동

GitHub 저장소를 Vercel에 연결하면 `git push` 할 때마다 자동 재배포. 실무 표준.

### GitHub에 올리기

```bash
git init
git add .
git commit -m "first deploy"
git branch -M main
git remote add origin https://github.com/내아이디/my-app.git
git push -u origin main
```

### Vercel 웹에서 GitHub 레포 연동 (권장)

2번에서 CLI로 만든 프로젝트에 Git을 붙이는 방법. 클릭만으로 끝, CLI 인증 안 꼬임.

```
Vercel 웹사이트 로그인 -> 해당 프로젝트 클릭
Overview                      # 프로젝트 대시보드 진입
  -> 좌측 사이드바 맨 아래 Settings 클릭
  -> Settings 탭 목록에서 Git 선택
  -> Connect Git Repository -> GitHub 레포 선택 연동
연동 후 git push -> 자동 재배포 켜짐
```

신규 프로젝트면 vercel.com/new -> Import Git Repository -> 레포 선택 -> Deploy 한 번에도 가능.

### CLI로 연결 (선택, 파워유저)

```bash
vercel link          # Vercel 프로젝트 연결
vercel git connect   # git 원격 연결 -> 자동 배포 켜짐
```

- `.vercel/` 폴더는 연결 정보 -> git에 올리지 말 것
- `.gitignore`에 `node_modules`, `dist`, `.vercel` 포함 확인
- 모노레포면 Settings -> Root Directory로 배포할 하위 폴더 지정

---

## 4. Claude 연동

3번에서 GitHub, Vercel 이미 연결됨 -> Claude에게 코드 작업 후 "깃허브에 푸시해줘" 하면 자동으로 Vercel에 반영. 터미널, CLI 직접 안 만짐.

### 흐름

1. Claude에게 코드 수정 요청
2. "깃허브 푸시해줘" 한마디
3. Claude가 git add, commit, push 실행
4. Vercel이 push 감지 -> 자동 재배포
5. 잠시 뒤 실서비스 URL에 반영

### 예시 대화

```
# 나
버튼 색 파란색으로 바꾸고 깃허브에 푸시해줘

# Claude
색상 변경 완료. 커밋, 푸시했습니다.
-> Vercel이 배포 시작 (1~2분 후 URL 반영)
```

- 핵심: 배포 명령을 따로 안 함. GitHub 연동(3번) 덕에 push = 배포. Claude는 push까지만 하면 끝.
- 주의: 커밋 author 이메일이 Vercel 계정과 맞아야 배포됨. 안 되면 `git config user.email` 확인.
