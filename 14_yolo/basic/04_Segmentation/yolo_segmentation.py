from ultralytics import YOLO
import cv2
import os  # 폴더 경로를 다루는 도구

# 이 스크립트가 있는 폴더. 실행 위치와 상관없이 같은 자리를 가리킵니다
base_dir = os.path.dirname(os.path.abspath(__file__))

# 1. 모델 로드
model=YOLO("yolo11n-seg.pt")

# 2. 모델 추론
results=model(os.path.join(base_dir, "input_seg.jpg"))

# 3. 결과 시각화
result_image=results[0].plot()

# 4. 결과 이미지 저장
output_image_path=os.path.join(base_dir, "result_seg.jpg")
cv2.imwrite(output_image_path, result_image)
print(f"사진이 잘 저장 되었습니다. => {output_image_path}")
