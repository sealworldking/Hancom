# https://pypi.org/project/pillow/11.1.0/
# pip install pillow==11.1.0

from PIL import Image, ImageEnhance, ImageOps # 이미지 증강
import matplotlib.pyplot as plt
import os # 폴더 경로를 다루는 도구
import glob # 파일 목록을 찾는 도구

# 1. 이미지 로드 (captured_images 안의 가장 최근 사진)
# 코드는 .vscode 안에 있고 데이터는 그 부모 폴더(12_DATA)에 있어서
# dirname을 한 번 더 씌워 한 칸 위를 가리킵니다
base_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_dir=os.path.join(base_dir,"captured_images")
img_path=max(glob.glob(os.path.join(img_dir,"*.jpg")), key=os.path.getmtime)
img=Image.open(img_path)
print(f"불러온 사진: {img_path}")

# 증강 결과를 담을 폴더 (없으면 자동으로 생성)
result_dir=os.path.join(base_dir,"result_images")
os.makedirs(result_dir, exist_ok=True)

# 2. 이미지 증강(회전)
img_rotated=img.rotate(90)

# 2-1. 이미지 증상(밝기 조절)
enhancer=ImageEnhance.Brightness(img)
img_brightness=enhancer.enhance(0.5)

# 2-2 이미지 증강(좌우 반전)
img_flip=ImageOps.mirror(img)

# 3. 결과 시각화
fig, ax=plt.subplots(2, 2, figsize=(20,10))

# 3-1. 원본 이미지
ax[0,0].imshow(img)
ax[0,0].axis('off')
ax[0,0].set_title("Original")

# 3-2. 회전 이미지
ax[0,1].imshow(img_rotated)
ax[0,1].axis('off')
ax[0,1].set_title("Rotated 90")

# 3-3. 밝기 이미지
ax[1,0].imshow(img_brightness)
ax[1,0].axis('off')
ax[1,0].set_title("Brightness")

# 3-4. 좌우 반전 이미지
ax[1,1].imshow(img_flip)
ax[1,1].axis('off')
ax[1,1].set_title("Flip")

# 4. 증강 이미지 저장 (result_images 폴더)
img_rotated.save(os.path.join(result_dir,"img_rotated.jpg"))
img_brightness.save(os.path.join(result_dir,"img_brightness.jpg"))
img_flip.save(os.path.join(result_dir,"img_flip.jpg"))
print(f"사진을 잘 저장했습니다. {result_dir}")

# 5. 화면에 띄우기
plt.show()