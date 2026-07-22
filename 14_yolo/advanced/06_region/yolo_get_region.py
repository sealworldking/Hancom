from ultralytics import YOLO
from collections import Counter
import cv2
import numpy as np

# 0. 실시간 객체 집계용 모델
model=YOLO("yolo11n.pt")
CONF=0.4

# 1. 비디오 경로 설정
#    yolo_region.py 와 같은 카메라여야 좌표가 맞음 (다르면 구역이 엉뚱한 곳에 잡힘)
CAM="cctv001"
cap=cv2.VideoCapture(f"http://210.99.70.120:1935/live/{CAM}.stream/playlist.m3u8")

# 1-1. 좌표 기준 프레임 크기 (yolo_region.py 의 resize 값과 같아야 함)
WIDTH, HEIGHT = 640, 480

# 2. 마우스 이벤트 처리 함수 정의
points=[]
def mouse_callback(event, x, y, flags, param):
    if event==cv2.EVENT_LBUTTONDOWN:    # 좌 클릭 = 점 추가
        points.append((x,y))
        print(f"\n{len(points)}번 점: ({x}, {y})")
        print_region()
    elif event==cv2.EVENT_RBUTTONDOWN:  # 우 클릭 = 마지막 점 취소
        if points:
            removed=points.pop()
            print(f"\n취소: {removed}")
            print_region()

def print_region():
    """현재 좌표를 한 줄로 요약 (전체 복사용 블록은 종료 시 1번만 출력)"""
    if len(points) < 3:
        return
    print(f"   현재 좌표: {points}")

# 3. 윈도우 창 설정 및 함수 등록
#    WINDOW_NORMAL 은 창 크기를 바꿀 수 있어서 마우스 좌표가 영상 좌표와 어긋남
#    -> WINDOW_AUTOSIZE 로 고정해서 1:1 보장
cv2.namedWindow("GET_X_Y", cv2.WINDOW_AUTOSIZE)
cv2.setMouseCallback("GET_X_Y", mouse_callback)

print(f"[{CAM}] 좌클릭으로 점 찍기, 우클릭 취소, q 종료")

# 4. 비디오 프레임 처리
try_count=0    # 처리한 프레임 수

while cap.isOpened():
    success, frame=cap.read()
    if not success:
        print("프레임 못 읽음!")
        break

    # 4-1. 프레임 크기 조정
    re_frame=cv2.resize(frame, (WIDTH, HEIGHT))

    # 4-1-1. 객체 탐지 후 종류별 집계
    #        점 3개 이상이면 그 구역 안에 있는 것만, 아니면 화면 전체
    try_count += 1
    det=model.predict(re_frame, conf=CONF, verbose=False)[0]
    inside=Counter()
    poly=np.array(points, np.int32) if len(points) >= 3 else None
    for box, cls in zip(det.boxes.xyxy, det.boxes.cls):
        x1, y1, x2, y2 = box.tolist()
        center=((x1+x2)/2, (y1+y2)/2)
        if poly is None or cv2.pointPolygonTest(poly, center, False) >= 0:
            inside[model.names[int(cls)]] += 1
    scope="구역" if poly is not None else "전체"
    detail=", ".join(f"{name}: {n}" for name, n in inside.items()) or "없음"
    print(f"\r시도 {try_count} [{scope}]: {detail}".ljust(70), end="", flush=True)

    # 4-2. 찍은 점과 연결선 표시
    for i, p in enumerate(points):
        cv2.circle(re_frame, p, 5, (0,0,255), -1)
        cv2.putText(re_frame, str(i+1), (p[0]+8, p[1]-8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 2)
    if len(points) >= 2:
        # 2개 이상이면 선 연결, 3개 이상이면 닫힌 다각형으로 미리보기
        closed = len(points) >= 3
        cv2.polylines(re_frame, [np.array(points, np.int32)], closed, (255,0,0), 2)

    # 4-3. 안내 문구
    cv2.rectangle(re_frame, (10,10), (250,35), (0,0,0), -1)
    cv2.putText(re_frame, f"points {len(points)}  (R-click: undo)",
                (16,29), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255,255,255), 1, cv2.LINE_AA)

    # 4-4. 프레임 시각화
    cv2.imshow("GET_X_Y", re_frame)

    # 4-5. q키를 눌러서 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("\nq 키를 눌러서 종료")
        break

# 5. 자원 해제
cap.release()
cv2.destroyAllWindows()

# 6. 결과 좌표 출력 (yolo_region.py 에 그대로 붙여넣기)
print()
print("=== region_points 복사용 ===")
print("region_points={")
print(f'    "region-01": {points}')
print("}")

# 7. 좌표 사용 안내
# 좌상단 1번
# 좌하단 2번
# 우하단 3번
# 우상단 4번
