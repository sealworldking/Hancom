import ssl, os
# CLIP 가중치를 내려받는데, 이 환경은 Windows 인증서 저장소 파싱이 깨져
# SSLError [ASN1: NOT_ENOUGH_DATA] 가 남 -> 인증서 검증을 끄고 다운로드
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

from ultralytics import solutions

# 0. 기준 폴더 (이 스크립트가 있는 위치) - 실행 위치와 무관하게 경로가 맞도록
BASE_DIR=os.path.dirname(os.path.abspath(__file__))

# 1. 검색할 이미지 폴더 (여기에 사진을 넣어두면 됨)
IMAGE_DIR=os.path.join(BASE_DIR, "images")

# 2. 검색 앱 생성 - CPU에서 동작 (GPU면 "cuda")
app=solutions.SearchApp(
    data=IMAGE_DIR,
    device="cpu"
)

# 3. 웹 서버 실행 -> 브라우저에서 http://127.0.0.1:5000 접속
app.run(debug=True) # 개발용 / 운영 시 False
