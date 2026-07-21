from ultralytics import YOLO
import shutil
import os

# 0. 저장 위치 (이 스크립트와 같은 폴더)
#    OpenVINO 는 경로에 한글이 있으면 못 읽음. 프로젝트가 C:\Hancom 이라 문제없음
DEST_DIR=os.path.dirname(os.path.abspath(__file__))
MODEL_DIR_NAME="yolo11n_openvino_model"   # 이동 후 폴더 이름 (고정)

# 1. 원본 PyTorch 모델 로드
model=YOLO("yolo11n.pt")

# 2. OpenVINO 형식으로 변환 (Intel CPU 부스터)
#    export 는 .pt 파일 옆에 폴더를 만들고 그 경로를 돌려줌
#    끝에 구분자가 붙어 나오므로 반드시 제거 (안 하면 basename 이 빈 문자열이 됨)
exported_path=str(model.export(format="openvino")).rstrip("\\/")

# 3. 저장 위치로 이동
target=os.path.join(DEST_DIR, MODEL_DIR_NAME)

# 3-1. 안전장치: target 이 정확히 모델 폴더인지 확인한 뒤에만 삭제
#      (경로가 어긋나 DEST_DIR 자체를 지우는 사고 방지)
if os.path.basename(target) != MODEL_DIR_NAME or os.path.abspath(target) == os.path.abspath(DEST_DIR):
    raise SystemExit(f"경로가 이상함, 중단: {target}")

if os.path.isdir(target):
    shutil.rmtree(target)

shutil.move(exported_path, target)

print("==================")
print(f"변환 완료: {target}")
