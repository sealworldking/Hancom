# conda activate py39
# pip install opencv-python

# 이미지에 마우스로 박스를 그려서 YOLO 형식(.txt)으로 저장하는 라벨링 도구
#
# 조작법
#   마우스 드래그 : 박스 그리기
#   0 ~ 9        : 클래스 번호 선택
#   u            : 마지막 박스 취소
#   c            : 현재 이미지의 박스 전부 지우기
#   n / p        : 다음 / 이전 이미지 (자동 저장)
#   s            : 지금 저장
#   e            : 전체 라벨을 CSV, JSON으로 내보내기
#   q 또는 ESC   : 종료 (자동 저장)

import cv2 # 이미지를 보여주고 마우스를 받는 도구
import numpy as np # 파일을 숫자 배열로 읽는 도구
import os # 폴더 경로를 다루는 도구
import glob # 파일 목록을 찾는 도구
import csv # CSV로 내보내는 도구
import json # JSON으로 내보내는 도구


def imread_kr(path):
    """한글이 든 경로에서도 이미지를 읽습니다.

    cv2.imread는 윈도우에서 경로를 ASCII로만 처리해서
    '바탕 화면' 같은 한글 폴더를 못 찾습니다.
    그래서 numpy로 파일을 통째로 읽은 뒤 cv2가 해독하게 합니다.
    """
    if not os.path.exists(path):
        return None
    data=np.fromfile(path, dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_COLOR)

# 1. 폴더 준비 (이 스크립트가 있는 폴더 기준)
# 코드는 .vscode 안에 있고 데이터는 그 부모 폴더(12_DATA)에 있어서
# dirname을 한 번 더 씌워 한 칸 위를 가리킵니다
base_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_dir=os.path.join(base_dir,"captured_images")
label_dir=os.path.join(base_dir,"labels")
os.makedirs(label_dir, exist_ok=True)

# 2. 클래스 목록 읽기 (없으면 기본값으로 새로 만듦)
classes_path=os.path.join(base_dir,"classes.txt")
if not os.path.exists(classes_path):
    with open(classes_path,"w",encoding="utf-8") as f:
        f.write("person\ncat\ndog\n")
    print(f"classes.txt를 새로 만들었습니다. {classes_path}")

with open(classes_path,encoding="utf-8") as f:
    # 줄 번호가 곧 클래스 번호. 빈 줄과 주석(#)은 건너뜀
    classes=[line.split("#")[0].strip() for line in f]
    classes=[c for c in classes if c]

# 클래스마다 다른 색 (BGR 순서)
colors=[(0,0,255),(0,255,0),(255,0,0),(0,255,255),(255,0,255),
        (255,255,0),(0,128,255),(128,0,255),(0,255,128),(128,128,255)]

# 3. 라벨링할 이미지 목록
img_paths=sorted(glob.glob(os.path.join(img_dir,"*.jpg")))
if not img_paths:
    print(f"이미지가 없습니다. {img_dir} 안에 .jpg 파일을 넣어주세요.")
    raise SystemExit

print(f"이미지 {len(img_paths)}장, 클래스 {len(classes)}개를 찾았습니다.")


def label_path_of(img_path):
    """이미지 경로에 대응하는 라벨 .txt 경로를 돌려줍니다."""
    name=os.path.splitext(os.path.basename(img_path))[0]
    return os.path.join(label_dir, name+".txt")


def load_boxes(img_path, img_w, img_h):
    """저장된 YOLO 라벨을 읽어서 픽셀 좌표 박스 목록으로 바꿉니다."""
    path=label_path_of(img_path)
    if not os.path.exists(path):
        return []

    boxes=[]
    with open(path,encoding="utf-8") as f:
        for line in f:
            parts=line.split()
            if len(parts)!=5:
                continue
            cls=int(parts[0])
            xc, yc, w, h=[float(v) for v in parts[1:]]
            # 정규화 값(0~1)을 다시 픽셀로 되돌림
            # int()로 자르면 소수점 오차 때문에 1픽셀씩 밀려서 round()를 씁니다
            x1=round((xc-w/2)*img_w)
            y1=round((yc-h/2)*img_h)
            x2=round((xc+w/2)*img_w)
            y2=round((yc+h/2)*img_h)
            boxes.append([cls,x1,y1,x2,y2])
    return boxes


def save_boxes(img_path, boxes, img_w, img_h):
    """픽셀 좌표 박스를 YOLO 정규화 형식으로 저장합니다."""
    path=label_path_of(img_path)

    # 박스가 하나도 없으면 빈 라벨 파일을 남깁니다 (YOLO에서 배경 이미지로 씀)
    with open(path,"w",encoding="utf-8") as f:
        for cls,x1,y1,x2,y2 in boxes:
            xc=((x1+x2)/2)/img_w
            yc=((y1+y2)/2)/img_h
            w=abs(x2-x1)/img_w
            h=abs(y2-y1)/img_h
            f.write(f"{cls} {xc:.6f} {yc:.6f} {w:.6f} {h:.6f}\n")
    return path


def export_all():
    """전체 라벨을 CSV와 JSON 한 파일씩으로 모아 내보냅니다."""
    rows=[]
    for path in img_paths:
        img=imread_kr(path)
        if img is None:
            continue
        h, w=img.shape[:2]
        for cls,x1,y1,x2,y2 in load_boxes(path,w,h):
            rows.append({
                "image": os.path.basename(path),
                "image_width": w,
                "image_height": h,
                "class_id": cls,
                "class_name": classes[cls] if cls<len(classes) else str(cls),
                "x_min": min(x1,x2),
                "y_min": min(y1,y2),
                "x_max": max(x1,x2),
                "y_max": max(y1,y2),
            })

    csv_path=os.path.join(base_dir,"labels.csv")
    with open(csv_path,"w",newline="",encoding="utf-8-sig") as f:
        writer=csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else
                              ["image","image_width","image_height","class_id",
                               "class_name","x_min","y_min","x_max","y_max"])
        writer.writeheader()
        writer.writerows(rows)

    json_path=os.path.join(base_dir,"labels.json")
    with open(json_path,"w",encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)

    print(f"박스 {len(rows)}개를 내보냈습니다.")
    print(f"  {csv_path}")
    print(f"  {json_path}")


# 4. 마우스 상태를 담아둘 변수
state={"drawing":False, "x1":0, "y1":0, "x2":0, "y2":0}
boxes=[] # 현재 이미지의 박스 목록
current_class=0


def on_mouse(event, x, y, flags, param):
    """마우스를 누르고 끌고 떼는 동안 박스 좌표를 기록합니다."""
    global boxes

    if event==cv2.EVENT_LBUTTONDOWN:
        state["drawing"]=True
        state["x1"], state["y1"]=x, y
        state["x2"], state["y2"]=x, y

    elif event==cv2.EVENT_MOUSEMOVE and state["drawing"]:
        state["x2"], state["y2"]=x, y

    elif event==cv2.EVENT_LBUTTONUP:
        state["drawing"]=False
        state["x2"], state["y2"]=x, y
        x1, y1=state["x1"], state["y1"]
        # 너무 작은 박스는 실수로 클릭한 것으로 보고 버립니다
        if abs(x-x1)>5 and abs(y-y1)>5:
            # 화면 밖으로 끌었어도 이미지 경계 안으로 잘라서 넣습니다
            bx1=max(0, min(x1,x))
            by1=max(0, min(y1,y))
            bx2=min(img_w-1, max(x1,x))
            by2=min(img_h-1, max(y1,y))
            boxes.append([current_class,bx1,by1,bx2,by2])


def draw_screen(img, img_w, img_h, index):
    """원본은 두고, 복사본 위에 박스와 안내문을 그려서 돌려줍니다."""
    view=img.copy()

    # 저장된 박스들
    for cls,x1,y1,x2,y2 in boxes:
        color=colors[cls%len(colors)]
        name=classes[cls] if cls<len(classes) else str(cls)
        cv2.rectangle(view,(x1,y1),(x2,y2),color,2)
        cv2.putText(view,f"{cls} {name}",(x1,max(y1-6,12)),
                    cv2.FONT_HERSHEY_SIMPLEX,0.5,color,2)

    # 지금 끌고 있는 박스
    if state["drawing"]:
        cv2.rectangle(view,(state["x1"],state["y1"]),(state["x2"],state["y2"]),
                      colors[current_class%len(colors)],1)

    # 안내문은 반투명 검은 띠 위에 한 번만 그립니다.
    # 검은 테두리를 덧그리면 두께 때문에 글자 간격이 벌어져서 겹쳐 보입니다.
    cls_name=classes[current_class] if current_class<len(classes) else "?"
    info=f"[{index+1}/{len(img_paths)}] class {current_class}:{cls_name}  boxes {len(boxes)}"
    help_text="0-9 class | u undo | c clear | n/p move | s save | e export | q quit"

    band=view.copy()
    cv2.rectangle(band,(0,0),(img_w,32),(0,0,0),-1) # 위쪽 띠
    cv2.rectangle(band,(0,img_h-28),(img_w,img_h),(0,0,0),-1) # 아래쪽 띠
    cv2.addWeighted(band,0.6,view,0.4,0,view) # 60%만 덮어서 사진이 비쳐 보이게

    cv2.putText(view,info,(10,22),cv2.FONT_HERSHEY_SIMPLEX,0.6,(255,255,255),1,cv2.LINE_AA)
    cv2.putText(view,help_text,(10,img_h-9),cv2.FONT_HERSHEY_SIMPLEX,0.45,(255,255,255),1,cv2.LINE_AA)

    return view


# 5. 메인 반복문
cv2.namedWindow("labeling")
cv2.setMouseCallback("labeling", on_mouse)

index=0
img=None
img_w=img_h=0
need_load=True

while True:
    if need_load:
        img=imread_kr(img_paths[index])
        if img is None:
            print(f"이미지를 못 읽었습니다. {img_paths[index]}")
            break
        img_h, img_w=img.shape[:2]
        boxes=load_boxes(img_paths[index], img_w, img_h)
        need_load=False

    cv2.imshow("labeling", draw_screen(img, img_w, img_h, index))
    key=cv2.waitKey(20) & 0xFF

    if key==255: # 아무 키도 안 눌림
        continue

    if ord("0")<=key<=ord("9"):
        picked=key-ord("0")
        if picked<len(classes):
            current_class=picked
        else:
            print(f"{picked}번 클래스는 classes.txt에 없습니다.")

    elif key==ord("u"):
        if boxes:
            boxes.pop()

    elif key==ord("c"):
        boxes=[]

    elif key in (ord("n"), ord("p")):
        save_boxes(img_paths[index], boxes, img_w, img_h)
        index=(index+1)%len(img_paths) if key==ord("n") else (index-1)%len(img_paths)
        need_load=True

    elif key==ord("s"):
        path=save_boxes(img_paths[index], boxes, img_w, img_h)
        print(f"저장했습니다. {path} (박스 {len(boxes)}개)")

    elif key==ord("e"):
        save_boxes(img_paths[index], boxes, img_w, img_h)
        export_all()

    elif key in (ord("q"), 27): # 27 = ESC
        save_boxes(img_paths[index], boxes, img_w, img_h)
        break

cv2.destroyAllWindows()
print("라벨링을 끝냈습니다.")
