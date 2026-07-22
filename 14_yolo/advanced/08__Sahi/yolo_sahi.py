# from sahi.utils.file import download_from_url

# # 작은 차량 이미지 (멀리서 찍은 도로)
# download_from_url(
#     "https://raw.githubusercontent.com/obss/sahi/main/demo/demo_data/small-vehicles1.jpeg",
#     "demo_data/small-vehicles1.jpeg",
# )

# # 항공 촬영 지형 이미지
# download_from_url(
#     "https://raw.githubusercontent.com/obss/sahi/main/demo/demo_data/terrain2.png",
#     "demo_data/terrain2.png",
# )

from ultralytics import YOLO
import cv2
import os

# 0. 기준 폴더 (이 스크립트가 있는 위치) - 실행 위치와 무관하게 경로가 맞도록
BASE_DIR=os.path.dirname(os.path.abspath(__file__))

# 1. 모델 로드
model=YOLO("yolo11n.pt")

# 2. 이미지 경로
input_image_path=os.path.join(BASE_DIR, "image_2.png")

# 3. 모델 예측
results=model(input_image_path)

# 4. 결과 시각화
annotated_frame=results[0].plot()

# 5. 결과 저장 (08__Sahi/sahi/ 아래에 저장)
output_dir=os.path.join(BASE_DIR, "sahi")
os.makedirs(output_dir, exist_ok=True) # 폴더 없으면 만들고, 있으면 거기에 저장
output_image_path=os.path.join(output_dir, "result_original.jpg")
cv2.imwrite(output_image_path, annotated_frame)

# 6. 탐지 개수 출력
detected=len(results[0].boxes)

print("==================")
print(f"기본 YOLO 추론 완료!! {output_image_path}")
print(f"탐지 수: {detected}")