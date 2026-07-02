# Stylelint — CSS 자동 검사·정렬 도구

## 한 줄 요약
Stylelint = CSS 전용 린터. 오타, 세미콜론 누락, 속성 순서 흐트러짐 등을 사람 대신 잡아줌.
HTML은 담당 아님 → HTML은 HTMLHint로 따로 검사.

## 작업 순서 (PowerShell 기준)

### 1. Node.js 설치 확인
npm은 Node.js에 포함되어 있으므로, Stylelint를 깔기 전에 Node부터 설치되어 있는지 확인한다.

```powershell
node -v
npm -v
```

버전이 뜨면 이미 설치된 것 (건너뛰기).
안 깔려 있으면 [nodejs.org](https://nodejs.org)에서 LTS 버전 설치 → `node`, `npm`이 함께 생김.

### 2. 폴더 이동 후 패키지 설치 (한 번만)

```powershell
cd practice/04_css/03
npm install -D stylelint stylelint-config-standard stylelint-order
```

⚠️ `npm init stylelint`은 쓰지 말 것 — 대화형 마법사라 취소 시 에러 나고, 이미 있는 `.stylelintrc.json`과 겹치는 설정 파일을 새로 만들어버림.

### 3. 검사 & 자동 수정

```powershell
npx stylelint "styles/main.css"          # 검사만
npx stylelint "styles/main.css" --fix    # 자동 수정 (정렬·오류)
```

- `.stylelintrc.json`의 `order/properties-alphabetical-order: true` 규칙 덕분에 속성이 알파벳순으로 자동 정렬됨.
- 순서만 바뀌고 화면 결과는 동일 → `index.html`을 브라우저로 열어 `--fix` 전/후 비교해서 확인.

#### `.stylelintrc.json`은 정렬 방식만 바꿀 수 있는 게 아님
`rules`에 다른 값을 넣으면 알파벳순 대신 다른 정렬 방식, 혹은 정렬 외의 다른 검사 규칙도 켤 수 있음.

- **정렬 방식 변경** — `order/properties-order`에 배열을 직접 지정하면 "위치 -> 박스모델 -> 타이포그래피 -> 색상" 같은 그룹 순서로 정렬 가능 (알파벳순이 아니라 실무에서 흔히 쓰는 방식):
  ```json
  "rules": {
    "order/properties-order": ["position", "top", "display", "width", "height", "margin", "padding", "background", "color", "font-size"]
  }
  ```
- **정렬 외 다른 규칙 추가** — `order` 플러그인이 아니어도 Stylelint 자체 규칙을 더 켤 수 있음:
  ```json
  "rules": {
    "order/properties-alphabetical-order": true,
    "color-no-invalid-hex": true,
    "no-duplicate-selectors": true,
    "declaration-block-no-duplicate-properties": true,
    "unit-allowed-list": ["px", "%", "rem"]
  }
  ```
- 즉 `.stylelintrc.json`은 "정렬기"가 아니라 "검사 규칙 설정 파일"이고, `order/*` 계열은 그중 순서 관련 규칙일 뿐 — 오타·중복·값 제한 등 원하는 규칙을 자유롭게 추가/제거할 수 있음.

### 4. HTML 검사는 HTMLHint로 별도 설치

```powershell
npm install -D htmlhint
npx htmlhint "index.html"
npx htmlhint "**/*.html"      # 폴더 전체 검사
```

- 규칙은 `.htmlhintrc`(JSON)으로 조정 (예: `tag-pair`, `id-unique`, `alt-require`).
- Stylelint의 `--fix`와 달리 자동 수정 기능은 없음 — 문제만 알려주고 직접 고쳐야 함.

## 핵심 요약
1. `node -v` / `npm -v`로 Node.js 설치 확인 (없으면 설치)
2. `npm install -D stylelint stylelint-config-standard stylelint-order`
3. `npx stylelint "styles/main.css" --fix`로 CSS 검사·자동 정렬
4. HTML은 `npm install -D htmlhint` 후 `npx htmlhint`로 따로 검사
