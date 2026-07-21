import ssl, os
# texts= 를 쓰면 CLIP 가중치를 내려받는데, 이 환경은 Windows 인증서 저장소 파싱이 깨져
# SSLError [ASN1: NOT_ENOUGH_DATA] 가 남 -> 인증서 검증을 끄고 다운로드
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

from ultralytics import FastSAM
import cv2

# 0. 기준 폴더 (이 스크립트가 있는 위치) - 실행 위치와 무관하게 경로가 맞도록
BASE_DIR=os.path.dirname(os.path.abspath(__file__))

# 1. 이미지 경로
source=os.path.join(BASE_DIR, "dog_picture.jpg")

# 2. FastSAM 모델 로드 (파일 없으면 자동 다운로드)
model=FastSAM("FastSAM-s.pt")

# 3. 텍스트 프롬프트 (CLIP 이 문장과 가장 비슷한 영역만 남김)
#    retina_masks=True : 마스크를 원본 해상도로 복원 (안 켜면 경계가 뭉개져 배경을 골라버림)
#    imgsz=1024        : 입력 해상도 확대 (원본이 4000px 급이라 640 으로는 정보 손실이 큼)
results=model(source, texts="dog", retina_masks=True, imgsz=1024)

# 4. 결과 이미지 생성
output_path=os.path.join(BASE_DIR, "output_fast_sam_result.jpg")
output_image=results[0].plot()

# 5. 결과 이미지 저장
cv2.imwrite(output_path, output_image)

# 6. 코드 완료 출력
print(f"결과 이미지가 잘 저장됐습니다. {output_path}")
