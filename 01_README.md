# Hancom - Front-End Bootcamp
- AI 기반 프론트엔드 웹개발자 양성과정 학습 기록입니다.

## 폴더 구조
학습한 순서대로 번호를 붙였습니다.

- `02_HTML/` - HTML 학습 (일자별 정리)
- `03_CSS/` - CSS 학습 (일자별 정리)
- `04_Netlify/` - 정적 사이트 배포 (드래그&드롭 · GitHub 연동)
- `05_JS/` - JavaScript 학습 (일자별 정리)
- `06_react/` - React (Vite 기반 프로젝트)
- `07_node_express/` - Node.js · Express 서버
- `08_GROQ/` - Groq API 챗봇 (백엔드 + chat-ui)
- `09_Vercel/` - Vercel 배포
- `10_Claude_Web/` - Claude 웹 활용 실습
- `11_Anaconda/` - Anaconda 가상환경 설정
- `12_python/` - Python 기초
- `13_DATA/` - 데이터 수집 · 라벨링 · 증강
- `14_yolo/` - YOLO 객체 탐지 (basic · advanced)
- `15_OPENAPI/` - 공공 OpenAPI 활용 (ITS CCTV + YOLO)
- `16_HuggingFace/` - HuggingFace 추론 API
- `17_transformers/` - 문장 유사도 · 감정 분석 · 텍스트 생성 · 요약 · 번역
- `18_OCR/` - Tesseract OCR (이미지에서 문자 인식)

## 가상환경
폴더마다 쓰는 환경이 다릅니다. 실행 전에 확인하세요.

| 환경 | Python | 쓰는 곳 |
|---|---|---|
| `py39` | 3.9 | `14_yolo`, `15_OPENAPI` (ultralytics, opencv) |
| `nlp310` | 3.10 | `17_transformers` (transformers, torch) |
| `ocrpy38` | 3.8 | `18_OCR` (pytesseract, pillow) |

각 파일 맨 위 또는 아래 주석에 필요한 환경과 설치 명령이 적혀 있습니다.

## API 키 관리
키는 코드에 직접 쓰지 않고 프로젝트 루트의 `.env`에 보관합니다.
`.env`는 `.gitignore`에 등록되어 git에 올라가지 않습니다.

필요한 키 목록은 `.env.example` 참고. 사용법:

```bash
cp .env.example .env   # 복사 후 실제 키 값 채우기
```

```python
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("ITS_API_KEY")
```