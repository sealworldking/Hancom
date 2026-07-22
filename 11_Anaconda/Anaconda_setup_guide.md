# Anaconda 로드맵 - 단계별로 배우는 환경 설정

프로젝트별로 독립된 파이썬 환경을 만들고 관리하는 Anaconda 셋업 가이드.

---

## 1. Anaconda란?

집 안에는 여러 방이 있다. 주방, 화장실, 거실, 안방처럼 방마다 목적이 다르고 도구도 따로 갖춘다.

코딩 프로젝트도 마찬가지다. 프로젝트마다 필요한 라이브러리와 버전이 다르다. A 프로젝트는 `numpy 1.24`가 필요한데 B 프로젝트는 `numpy 2.0`이 필요할 수 있다. 이걸 한 공간에 다 깔면 버전이 충돌하고, 한쪽을 고치면 다른 쪽이 깨진다.

**Anaconda는 프로젝트별로 독립된 "방(가상환경)"을 만들어주는 관리자다.** 방끼리 서로 간섭 없이 깔끔하게 분리해준다.

- 공식 사이트: https://www.anaconda.com/
- 다운로드 아카이브: https://repo.anaconda.com/archive/

---

## 2. 설치하기 (Windows)

아카이브 페이지에서 설치 파일을 받아 설치한다.

1. 아카이브 페이지에서 `Anaconda3-...-Windows-x86_64.exe` 다운로드
2. 설치 파일 더블클릭 -> Next -> I Agree -> **Just Me** 선택
3. 설치 경로 기본값 유지 -> Next
4. **"Add Anaconda3 to my PATH"** 체크 -> Install -> Finish

> "Add to PATH"를 체크하면 어느 터미널(cmd, PowerShell)에서든 `conda` 명령을 바로 쓸 수 있다. 체크하지 않으면 Anaconda Prompt에서만 동작한다.

### 설치 확인

```bash
conda --version    # conda(관리자)가 깔렸는지, 버전 확인
conda info         # 현재 설정, 환경 목록, 경로 등 전체 정보
python --version   # 파이썬이 잡히는지 확인
```

---

## 3. 가상환경 관리

### 환경 생성 - 기본 형식

```bash
conda create -n 환경이름 python=3.10
```

- `-n 환경이름`: 만들 환경(방)의 이름을 정한다.
- `python=3.10`: 이 방에 깔 파이썬 버전을 지정한다.

### 실전 예시

```bash
conda create -n cv_env python=3.10     # 컴퓨터비전용
conda create -n nlp_env python=3.9      # 자연어처리용
conda create -n myproject python=3.11   # 새 프로젝트용
```

### 환경 활성화 / 비활성화

```bash
conda activate cv_env    # cv_env 방으로 들어가기 (앞에 (cv_env) 표시됨)
conda deactivate         # 방에서 나오기 (base로 돌아감)
```

환경을 활성화한 뒤 설치하는 라이브러리는 그 방에만 들어간다.

### 환경 목록 / 삭제

```bash
conda env list               # 지금까지 만든 환경(방) 전체 목록
conda env remove -n cv_env   # cv_env 방을 통째로 삭제
```

### Anaconda 유지보수

```bash
conda info           # 현재 상태 확인
conda update conda   # conda(관리자)를 최신 버전으로
conda clean --all    # 캐시, 안 쓰는 패키지 정리해 용량 확보
```

---

## 4. 패키지 관리 (pip)

가상환경을 활성화한 상태에서 `pip`으로 라이브러리를 설치한다. 그 라이브러리는 지금 켜진 환경에만 설치된다.

### 기본 설치

```bash
pip install package-name
```

### 고급 설치

```bash
pip install package1 package2 package3   # 여러 개 한 번에 설치
pip install -r requirements.txt          # 목록 파일에 적힌 패키지를 한꺼번에 설치
pip install package==1.2.3               # 특정 버전 지정 설치
pip install --upgrade package            # 이미 깔린 패키지를 최신으로 업그레이드
```

### 패키지 목록 조회

```bash
pip list   # 현재 환경에 설치된 패키지 목록 보기
```

> conda와 pip 차이: `conda`는 파이썬 버전과 파이썬이 아닌 도구(CUDA 등)까지 관리하고, `pip`은 PyPI의 파이썬 패키지만 설치한다. 한 환경에서 같은 패키지를 두 도구로 번갈아 설치하면 꼬일 수 있으니 되도록 한쪽으로 통일한다.

---

## 5. 환경 내보내기 & 공유

내가 만든 환경을 남이 똑같이 재현하게 하려면, 설치된 패키지와 버전을 파일로 뽑아 건네준다.

### conda 방식 - 환경 전체를 yml 파일로

```bash
conda env export > environment.yml      # 현재 환경을 파일로 내보내기
conda env create -f environment.yml     # 그 파일로 똑같은 환경 복원
```

- `>`는 명령의 출력을 화면 대신 파일로 보내라는 기호다.

### pip 방식 - 설치된 패키지 목록만

```bash
pip freeze > requirements.txt           # 설치 목록을 파일로 저장
pip install -r requirements.txt         # 그 목록대로 설치
```

### pipreqs - 실제 import한 것만 추출

`pip freeze`는 환경에 깔린 걸 전부 뽑지만, `pipreqs`는 실제 코드에서 import한 것만 골라 깔끔한 목록을 만든다.

```bash
pip install pipreqs
pipreqs --force --savepath=requirements.txt .
```

- `--force`: 기존 requirements.txt가 있어도 덮어쓴다.
- `--savepath`: 저장할 파일 경로를 지정한다.
- 마지막 `.`은 현재 폴더를 스캔 대상으로 삼는다는 뜻이다.

---

## 요약

1. **설치**: 아카이브에서 exe 받아 설치, "Add to PATH" 체크
2. **가상환경**: `conda create` -> `conda activate` -> 작업 -> `conda deactivate`
3. **패키지**: `pip install`로 환경 안에만 설치
4. **공유**: `environment.yml` 또는 `requirements.txt`로 내보내 팀원과 같은 환경 재현

핵심: 프로젝트마다 방을 나누고(가상환경), 그 방의 도구 목록을 파일로 공유하면 어디서든 같은 환경을 재현할 수 있다.
