# 1. pyfiglet, termcolor 불러오기
# 2. pyfiglet 적용
# 3. termcolor 적용
# 4. pyfiglet + termcolor 적용된 텍스트

import pyfiglet
from termcolor import colored

sentence = "PYTHON"

# pyfiglet.figlet_format(문자열, font=글꼴)
# standard = 기본 글꼴. font 안 줘도 이게 쓰임
py_sentence = pyfiglet.figlet_format(sentence, font="standard")

# colored(문자열, 글자색, 배경색, attrs=[스타일])
color_sentence = colored(py_sentence, "blue", attrs=["bold"])

print(color_sentence)
