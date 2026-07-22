from ultralytics import YOLO
import cv2
import time
import os

# 1. 모델 선택 (시작 시 사용할 모델, 실행 중 o 키로 전환 가능)
USE_OPENVINO=False

# yolo_export.py 가 이 스크립트와 같은 폴더에 모델을 만들어 둠
# (OpenVINO 는 경로에 한글이 있으면 RuntimeError 로 못 읽으므로 C:\Hancom 아래에 둠)
BASE_DIR=os.path.dirname(os.path.abspath(__file__))
OPENVINO_PATH=os.path.join(BASE_DIR, "yolo11n_openvino_model")
PYTORCH_PATH="yolo11n.pt"

# 1-1. 두 모델을 미리 로드 (전환할 때마다 로드하면 몇 초씩 멈춤)
print("모델 로드 중...")
models={
    "PyTorch": YOLO(PYTORCH_PATH, task="detect"),
    "OpenVINO": YOLO(OPENVINO_PATH, task="detect")
}

model_name="OpenVINO" if USE_OPENVINO else "PyTorch"
model=models[model_name]
print(f"모델: {model_name}   (o 키 = 전환, q 키 = 종료)")

# 1-2. 모델별 평균 FPS 누적용
fps_sum={"PyTorch":0.0, "OpenVINO":0.0}
fps_cnt={"PyTorch":0, "OpenVINO":0}

# 2. 비디오 경로 설정
cap=cv2.VideoCapture(0)

# 3. 프레임 처리
while cap.isOpened():
    success, frame=cap.read()
    if not success:
        print("프레임 읽기 실패 ㅠㅠ")
        break

    #3-1. 추론 시간 측정
    start_time=time.perf_counter()
    results=model(frame, verbose=False)
    end_time=time.perf_counter()

    # 3-2. FPS 계산(1초 나누기 1장 걸린 시간)
    model_time=end_time-start_time
    fps=1/model_time
    fps_sum[model_name]+=fps
    fps_cnt[model_name]+=1
    avg=fps_sum[model_name]/fps_cnt[model_name]

    # 3-3. 결과 이미지 및 FPS 표시
    annotated_frame=results[0].plot()
    cv2.putText(
        annotated_frame,
        f"{model_name}  {fps:.1f} FPS  (avg {avg:.1f})",   # 표시할 문자열
        (10, 30),               # 글자 위치
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0,255,0),
        2
    )
    cv2.putText(
        annotated_frame,
        "o: switch model   q: quit",
        (10, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255,255,255),
        1
    )

    cv2.imshow("YOLO FPS", annotated_frame)

    # 3-4. 키 입력 처리
    key=cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        print("q키를 눌러서 종료")
        break
    elif key == ord('o'):
        # o 키 = 모델 전환 (미리 로드해둔 것으로 교체)
        model_name="OpenVINO" if model_name=="PyTorch" else "PyTorch"
        model=models[model_name]
        print(f"모델 전환: {model_name}")

# 4. 결과 요약 출력
print("==================")
for name in ("PyTorch", "OpenVINO"):
    if fps_cnt[name]:
        print(f"{name}: 평균 {fps_sum[name]/fps_cnt[name]:.2f} FPS ({fps_cnt[name]} 프레임)")

# 5. 자원 해제
cap.release()
cv2.destroyAllWindows()
