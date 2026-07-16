# Python 설치 가이드 (Windows)

## 1. 설치 파일 받기

1. https://www.python.org/downloads/ 접속
2. **Download Python 3.x.x** 노란 버튼 클릭 (Windows 64비트 설치 파일 자동 선택됨)

## 2. 설치 실행

설치 화면에서 **반드시** 아래 체크박스 켜기:

- [x] **Add python.exe to PATH** (맨 아래, 이거 안 켜면 터미널에서 `python` 명령 안 먹음)

그다음 **Install Now** 클릭.

> PATH 체크 잊었으면: 설치 파일 다시 실행 → Modify → Next → Add Python to environment variables 켜기

## 3. 설치 확인

새 터미널(PowerShell) 열고:

```powershell
python --version
pip --version
```

버전 번호 나오면 성공. `python`이 Microsoft Store를 열면 PATH 설정이 잘못된 것.

### Microsoft Store가 열릴 때

설정 → 앱 → 앱 실행 별칭 → **앱 설치 관리자 python.exe / python3.exe** 끄기.

## 4. VS Code 연결

1. 확장 탭(Ctrl+Shift+X)에서 **Python** (Microsoft 제작) 설치
2. `Ctrl+Shift+P` → **Python: Select Interpreter** → 설치한 버전 선택
3. `.py` 파일 열고 우측 상단 실행(▶) 버튼으로 테스트

## 5. 가상환경 (프로젝트마다 권장)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

터미널 앞에 `(.venv)` 붙으면 활성화됨. 이 상태에서 `pip install` 하면 프로젝트 안에만 설치됨.

Activate가 막히면(실행 정책 오류):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

가상환경 만든 뒤 VS Code에서 **Python: Select Interpreter** 다시 실행해서 `.venv` 선택.

비활성화:

```powershell
deactivate
```

## 6. 패키지 설치

```powershell
pip install requests
pip freeze > requirements.txt   # 목록 저장
pip install -r requirements.txt # 목록대로 복원
```

## 흔한 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| `python : 용어를 인식할 수 없습니다` | PATH 미등록 | 2번 항목 Modify로 재설정 |
| Store 창이 열림 | 앱 실행 별칭 | 3번 항목 별칭 끄기 |
| `Activate.ps1 실행할 수 없음` | 실행 정책 | 5번 항목 ExecutionPolicy |
| VS Code가 옛 버전 씀 | 인터프리터 선택 안 함 | 4번 항목 Select Interpreter |
