# 람다 공식
# 함수명: lambda 매개변수(파라미터):반환값

# def add(a, b):
    # return a+b
# print(add(7, 3))
# 10

# add=lambda a, b : a + b
# print(add(7, 3))
# 10

# 글자를 넣으면 큰 그림 글씨로 출력(pyfiglet)해주는 lambda 함수

import pyfiglet

letter = input("원하는 글씨를 입력: ")

do_the_thing = lambda letter: pyfiglet.figlet_format(letter)

print(do_the_thing(letter))