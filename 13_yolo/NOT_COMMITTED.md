# 저장소에 올리지 않은 파일 정리

이 폴더의 실습 코드는 전부 올렸지만, 일부 파일은 의도적으로 제외했다.
제외 규칙은 프로젝트 루트의 `.gitignore`에 있다.

---

## 1. 모델 가중치 (`.pt`)

| 파일 | 용량 | 위치 |
|---|---|---|
| `ViT-B-32.pt` (CLIP) | 338MB | `advanced/10_Fast_Sam/weights/clip/` |
| `FastSAM-s.pt` | 23MB | `advanced/10_Fast_Sam/` |
| `yolo11n.pt` | 5.4MB × 5개 | `05_Distance`, `06_region`, `09_Speed`, `11_Export`, `13_Streamlit` |

**제외 이유**

- **자동 다운로드된다.** 코드를 실행하면 ultralytics가 필요한 가중치를 알아서 내려받는다. 저장소에 둘 이유가 없다.
- **GitHub 파일 크기 상한이 100MB다.** `ViT-B-32.pt`가 338MB라 애초에 푸시가 거부된다.
- **깃은 이진 파일에 약하다.** 텍스트 파일은 바뀐 줄만 저장하지만, `.pt` 같은 이진 파일은 조금만 바뀌어도 통째로 새 사본이 쌓인다. 한 번 커밋하면 나중에 지워도 기록에 남아 용량이 줄지 않는다.

**규칙**

```
# YOLO 모델 가중치 (실행 시 자동 다운로드됨)
*.pt
```

---

## 2. OpenVINO 변환 모델

| 폴더 | 용량 | 위치 |
|---|---|---|
| `yolo11n_openvino_model/` | 11MB | `advanced/11_Export/` |

**제외 이유**

- **재생성 가능하다.** `advanced/11_Export/yolo_export.py`를 한 번 실행하면 같은 폴더에 다시 만들어진다.
- 안에 든 `yolo11n.bin`이 11MB짜리 이진 파일이라 위와 같은 문제가 있다.

**복원 방법**

```bash
python 13_yolo/advanced/11_Export/yolo_export.py
```

실행 전 `pip install openvino`가 필요하다.

**규칙**

```
# OpenVINO 변환 모델 (yolo_export.py 로 재생성 가능)
*_openvino_model/
```

---

## 3. 이메일 자격증명이 들어가는 실습 파일

| 파일 | 위치 |
|---|---|
| `yolo_alarm.py` | `advanced/03_Alarm/` |

**제외 이유**

`solutions.SecurityAlarm`은 Gmail SMTP로 경고 메일을 보내므로 코드 안에 발신 주소와 앱 비밀번호를 적어야 한다.
이 값이 저장소에 올라가면 누구나 볼 수 있고, **나중에 지워도 커밋 기록에는 남는다.**

그래서 파일 자체를 제외하고 로컬에만 두기로 했다. 실행 결과 이미지 `alarm.png`는 자격증명이 없으므로 올렸다.

**규칙**

```
# 이메일 자격증명이 들어가는 실습 파일 (로컬에만 보관)
13_yolo/advanced/03_Alarm/yolo_alarm.py
```

**참고 - 코드 구조**

파일 내용 자체는 다른 실습과 동일한 형태다. 자격증명 부분만 아래처럼 비워두고 로컬에서 채워 쓴다.

```python
# 2. 이메일 인증
frome_email=""
password=""  # Gmail 앱 비밀번호 16자리 (코드에 직접 적지 말 것)
to_email=""
```

앱 비밀번호는 Google 계정에서 2단계 인증을 켠 뒤 별도로 발급받는다.
계정 비밀번호로는 SMTP 로그인이 되지 않는다. 앱 비밀번호는 메일 발송 권한만 가진 16자리 키라, 유출되더라도 그 키만 폐기하면 본 계정은 안전하다.

**더 나은 방법**

실전에서는 파일을 제외하는 대신 값만 환경변수로 분리하는 편이 낫다. 그러면 코드는 저장소에 두면서 값만 감출 수 있다.

```python
import os
frome_email=os.environ.get("GMAIL_ADDR")
password=os.environ.get("GMAIL_PW")
to_email=os.environ.get("GMAIL_ADDR")
```

---

## 저장소를 새로 받았을 때

```bash
git clone https://github.com/sealworldking/Hancom.git
cd Hancom
```

이후 필요한 것은 두 가지뿐이다.

1. **패키지 설치**

   ```bash
   pip install ultralytics opencv-python sahi openvino streamlit flask faiss-cpu shapely
   ```

2. **실행**

   각 실습 폴더의 `.py` 파일을 실행하면 필요한 모델 가중치가 자동으로 내려받아진다.
   OpenVINO 비교 실습만 `yolo_export.py`를 먼저 한 번 돌려야 한다.

`03_Alarm`은 파일이 없으므로, 쓰려면 위 코드 구조를 참고해 직접 작성하면 된다.
