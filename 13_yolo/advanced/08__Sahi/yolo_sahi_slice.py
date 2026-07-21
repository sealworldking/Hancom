from sahi.predict import get_sliced_prediction
from sahi import AutoDetectionModel
import os

# 0. 기준 폴더 (이 스크립트가 있는 위치) - 실행 위치와 무관하게 경로가 맞도록
BASE_DIR=os.path.dirname(os.path.abspath(__file__))

# 1. 모델 경로
model_path="yolo11n.pt"

# 2. 모델 로드
detection_model=AutoDetectionModel.from_pretrained(
    model_type="ultralytics",
    model_path=model_path,
    confidence_threshold=0.4
)

# 3. 이미지 경로
input_image_path=os.path.join(BASE_DIR, "image_2.png")

# 4. SAHI 적용 (이미지를 200x200 조각으로 잘라 각각 추론 -> 작은 객체 탐지율 향상)
results=get_sliced_prediction(
    input_image_path,
    detection_model,
    slice_width=200,
    slice_height=200,
    overlap_width_ratio=0.1,
    overlap_height_ratio=0.1,
)

# 5. 결과 시각화 및 저장 (08__Sahi/sahi/ 아래에 저장)
output_dir=os.path.join(BASE_DIR, "sahi")
os.makedirs(output_dir, exist_ok=True)
results.export_visuals(export_dir=output_dir, file_name="result_sahi_sliced")

# 6. 탐지 개수 출력
detected=len(results.object_prediction_list)

print("==================")
print(f"SAHI 추론 완료!! {os.path.join(output_dir, 'result_sahi_sliced.png')}")
print(f"탐지 수: {detected}")
