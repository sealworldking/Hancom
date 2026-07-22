import pytesseract          # 이미지에서 문자 인식
from PIL import Image       # 이미지 처리
import os                   # 폴더 경로를 다루는 도구

# 이 스크립트가 있는 폴더. 실행 위치와 상관없이 같은 자리를 가리킴
base_dir = os.path.dirname(os.path.abspath(__file__))

# 1. Tesseract 실행 파일 경로 지정
pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"

# 2. 이미지 불러오기
# "tesseract.png" 처럼 그냥 쓰면 "실행한 폴더" 에서 찾음
#   => VS Code 는 C:\Hancom 에서 실행하므로 FileNotFoundError 가 남
image = Image.open(os.path.join(base_dir, "tesseract.png"))

# 3. OCR 수행
results = pytesseract.image_to_string(
    image,
    lang="eng"
)

# 4. 결과 출력
print(results)