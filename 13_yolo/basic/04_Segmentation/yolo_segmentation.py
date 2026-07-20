from ultralytics import YOLO
import cv2

# 1. 모델 로드
model=YOLO("yolo11n-seg.pt")

# 2. 모델 추론
results=model("13_yolo/04_Segmentation/input_seg.jpg")

# 3. 결과 시각화
result_image=results[0].plot()

# 4. 결과 이미지 저장
output_image_path="13_yolo/04_Segmentation/result_seg.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"사진이 잘 저장 되었습니다. => {output_image_path}")
