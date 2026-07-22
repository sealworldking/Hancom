from ultralytics import solutions
from collections import Counter
from shapely.geometry import Point
import cv2

# 1. 비디오 경로 설정
cap=cv2.VideoCapture("http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8")

# 2. 구역 좌표 설정
region_points={
    "region-01": [(218, 283), (203, 367), (449, 375), (372, 254)]
}

# 3. 모델 로드 및 구역 객체 생성
yolo_region=solutions.RegionCounter(
    model="yolo11n.pt",
    show=False,
    region=region_points,
    conf=0.4, #임계값(신뢰도)
    verbose=False # 프레임마다 찍히는 기본 로그 끔 (실시간 한 줄 출력이 깨지지 않게)
)

# 4. 프레임 처리
try_count=0    # 처리한 프레임 수

while cap.isOpened():
    success, frame=cap.read()
    if not success:
        print("프레임 읽기 실패 ㅠㅠ")
        break

    # 4-1. 프레임 크기 조정
    re_frame=cv2.resize(frame, (640, 480))

    # 4-2. 구역 내 객체 수 계산
    results=yolo_region(re_frame)

    # 4-3. 구역별 카운트를 좌측 상단에 표시
    #      기본 표시는 구역 중심에 작은 숫자라 객체 라벨에 가려짐
    plot_im=results.plot_im
    lines=[f"{name}  {count}" for name, count in results.region_counts.items()]

    FONT=cv2.FONT_HERSHEY_SIMPLEX
    SCALE=0.5
    THICK=1
    PAD=8
    LINE_H=20
    width=max(cv2.getTextSize(t, FONT, SCALE, THICK)[0][0] for t in lines)
    cv2.rectangle(plot_im,
                  (10, 10),
                  (10 + width + PAD*2, 10 + LINE_H*len(lines) + PAD*2),
                  (0,0,0), -1)
    for i, text in enumerate(lines):
        cv2.putText(plot_im, text,
                    (10+PAD, 10+PAD+LINE_H*(i+1)-6),
                    FONT, SCALE, (255,255,255), THICK, cv2.LINE_AA)

    # 4-4. 터미널에 실시간 갱신 출력 (구역 안 객체를 종류별로 집계)
    try_count += 1
    inside=Counter()
    for box, cls in zip(yolo_region.boxes, yolo_region.clss):
        center=Point((box[0]+box[2])/2, (box[1]+box[3])/2)
        for region in yolo_region.counting_regions:
            if region["prepared_polygon"].contains(center):
                inside[yolo_region.names[int(cls)]] += 1
                break
    detail=", ".join(f"{name}: {n}" for name, n in inside.items()) or "없음"
    print(f"\r시도 {try_count}: {detail}".ljust(70), end="", flush=True)

    # 4-5. 프레임 표시(시각화)
    cv2.imshow("Region", plot_im)

    # 4-6. q키를 눌러서 종료
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("\nq키를 눌러서 종료")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()