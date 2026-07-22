from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
stream_url="http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap=cv2.VideoCapture(stream_url)

# 2. 속도 추정객체 생성 및 모델 로드
yolo_speed=solutions.SpeedEstimator(
    model="yolo11n.pt",
    show=False,
    classes=[2],
    line_width=2, # 바운딩 박스 선 두께
    max_speed=120, # 최대 속도 상한
    meter_per_pixel=0.5, # 픽셀 1개 = 실제 0.5m(환경별 직접 보정 필수)
    verbose=False # 프레임마다 찍히는 기본 로그 끔
)

# 3. 프레임 처리
while cap.isOpened():
    success, frame=cap.read()
    if not success:
        print("프레임 읽기 실패 ㅠㅠ")
        break
    
    # 3-1. 속도 계산 및 추적 수행
    results=yolo_speed(frame)

    #3-2. 결과 프레임 표시
    cv2.imshow("Speed", results.plot_im)

    #3-3. q키를 눌러서 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q 키를 눌러서 종료합니다.")
        break

# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()