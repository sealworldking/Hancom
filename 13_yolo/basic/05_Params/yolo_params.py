from ultralytics import YOLO
import cv2
import os # 폴더 경로를 다루는 도구

# 이 스크립트가 있는 폴더. 결과를 여기에 모으려고 씁니다
base_dir=os.path.dirname(os.path.abspath(__file__))

# 1. 모델 로드
model=YOLO("yolo11n.pt")

# 2. 모델 파라미터
model(
    "13_yolo/05_Params/input_params.jpg", # 추론할 이미지 경로

    save=True,                            # 결과를 파일로 저장
    #conf=0.5,                            # 신뢰도
    #max_det=3,                           # 탐지할 최대 개수
    #save_crop=True,                      # 탐지된 객체 폴더 및 이미지 저장
    #save_txt=True,                       # 좌표 텍스트 저장
    #save_conf=True,                      # 좌표 파일에 신뢰도까지 기록
    classes=[60,75],                      # 이 두 클래스만 남김 (CoCo 클래스 번호 기준, 60=dining table, 75=vase)

    # 결과 저장 위치. 상대경로를 주면 Ultralytics가 runs/detect 밑으로 되돌려서
    # 절대경로로 넘겨야 이 폴더 안에 들어갑니다
    project=os.path.join(base_dir,"runs","detect"),
    name="predict"
)
