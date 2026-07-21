from ultralytics import solutions
from ultralytics.solutions.solutions import SolutionAnnotator
import cv2

# 0. ultralytics 기본 "Pixels Distance" 배너 제거 (연결선/점만 남김)
def _line_only(self, pixels_distance, centroids,
               line_color=(104,31,17), centroid_color=(255,0,255)):
    cv2.line(self.im, centroids[0], centroids[1], line_color, 3)
    cv2.circle(self.im, centroids[0], 6, centroid_color, -1)
    cv2.circle(self.im, centroids[1], 6, centroid_color, -1)

SolutionAnnotator.plot_distance_and_line=_line_only

# 1. 비디오 경로 설정
stream_url="http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap=cv2.VideoCapture(stream_url)

# 2. 모델 로드 및 거리 계산 객체 생성
#    show=True 로 두면 q 종료 시 ultralytics 내부에서 창을 먼저 지우고
#    setMouseCallback 을 호출해 NULL window 에러가 남 -> show=False 로 직접 관리
distance=solutions.DistanceCalculation(
    model="yolo11n.pt",
    show=False
)

# 2-1. 마우스 콜백
#      ultralytics 기본 콜백은 빗나간 클릭도 left_mouse_count 를 올려서
#      2번 헛클릭하면 그 뒤로 영영 선택이 안 됨 -> 직접 구현
def on_mouse(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        if len(distance.selected_boxes) >= 2:
            return
        # 클릭 지점을 포함하는 박스 중 가장 작은 것 선택 (겹칠 때 정확도 향상)
        hits=[]
        for box, track_id in zip(distance.boxes, distance.track_ids):
            x0, y0, x1, y1 = distance.get_enclosing_box(box)
            if x0 < x < x1 and y0 < y < y1 and track_id not in distance.selected_boxes:
                hits.append((( x1-x0)*(y1-y0), track_id, box))
        if hits:
            _, track_id, box = min(hits, key=lambda h: h[0])
            distance.selected_boxes[track_id]=box
            print(f"선택: id={track_id} ({len(distance.selected_boxes)}/2)")
        else:
            print("빈 곳 클릭 - 박스 안을 클릭하세요")
    elif event == cv2.EVENT_RBUTTONDOWN:
        distance.selected_boxes={}
        distance.left_mouse_count=0
        print("선택 초기화")

# 2-2. 창 생성 + 콜백 연결 (좌클릭 2개 선택, 우클릭 초기화)
WINDOW="DISTANCE"
cv2.namedWindow(WINDOW)
cv2.setMouseCallback(WINDOW, on_mouse)

# 3. 프레임 처리 루프
prev_status=None    # 직전 상태 (같은 상태 반복 출력 방지)

while cap.isOpened():
    success, frame=cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 거리 계산 수행 (distance(frame) 이 내부에서 process() 를 호출함)
    results=distance(frame)
    plot_im=results.plot_im

    # 3-2. pixels_distance 추출
    pixel_distance=results.pixels_distance

    # 3-3. 거리에 따른 상태 정의
    if pixel_distance is None or pixel_distance == 0:
        status=None
        lines=[
            f"SELECT  {len(distance.selected_boxes)}/2",
            "L-click: pick   R-click: reset   q: quit"
        ]
    else:
        if pixel_distance>=150:
            status="SAFE"
        elif pixel_distance>=100:
            status="WARNING"
        else:
            status="DANGER"
        lines=[
            f"STATUS  {status}",
            f"DIST    {pixel_distance:.0f} px"
        ]

    # 3-4. 좌측 상단 정보 패널 (검은 배경 + 흰 글씨)
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

    # 3-5. 상태 출력 (상태가 바뀔 때만 출력해서 로그 폭주 방지)
    if status != prev_status:
        if status is None:
            print("[거리] ---px [상태] 선택 안됨")
        else:
            print(f"[거리] {pixel_distance:.0f}px [상태] => {status}")
        prev_status=status

    # 3-6. 화면 표시
    cv2.imshow(WINDOW, plot_im)

    # 3-7. q키를 눌러서 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()
