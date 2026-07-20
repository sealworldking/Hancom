# conda activate py39
# pip install opencv-python

import cv2 # 카메라를 다루는 도구
import numpy as np # 파일을 숫자 배열로 다루는 도구
import os # 폴더를 만드는 도구
from datetime import datetime # 지금 시간을 알려주는 도구


def imwrite_kr(path, img):
    """한글이 든 경로에도 이미지를 저장합니다.

    cv2.imwrite는 윈도우에서 경로를 ASCII로만 처리해서
    '바탕 화면' 같은 한글 폴더에는 저장이 실패합니다.
    그래서 cv2로 먼저 압축한 뒤 numpy로 파일을 씁니다.
    """
    ext=os.path.splitext(path)[1] # 확장자로 저장 형식을 정함
    success, buffer=cv2.imencode(ext, img)
    if success:
        buffer.tofile(path)
    return success

# 1. 사진을 저장할 폴더 준비 (이 스크립트가 있는 폴더 기준)
# 코드는 .vscode 안에 있고 데이터는 그 부모 폴더(12_DATA)에 있어서
# dirname을 한 번 더 씌워 한 칸 위를 가리킵니다
base_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
save_dir=os.path.join(base_dir,"captured_images")
os.makedirs(save_dir, exist_ok=True) # 폴더가 없으면 자동으로 생성

# 2. 카메라를 켭니다.
cap=cv2.VideoCapture(0)

# 3. 사진을 한 장 찍습니다.
success, frame=cap.read()
if success:
    timestamp=datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path=os.path.join(save_dir,f"result_{timestamp}.jpg")

    # 파일로 저장
    if imwrite_kr(file_path, frame):
        print(f"사진이 저장됐습니다. {file_path}")
    else:
        print("사진 저장에 실패했습니다.")
else:
    print("카메라를 못 읽었습니다.")

# 4. 카메라를 끕니다.
cap.release()