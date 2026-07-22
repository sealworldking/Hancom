# with = 파일을 다 쓰면 자동으로 닫아주는 안전장치
# 들여쓴 블록을 빠져나오면 알아서 닫힘

# "w" 새로 쓰기 - 기존 내용 덮어쓰기, 없으면 새로 만들기
with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("안녕, 파이썬!\n")
    f.write("with문이 자동으로 닫아줌\n")

print("잘 작성되었습니다.")

# "a" 이어 쓰기 - 기존 내용 그대로, 맨 끝에만 덧붙이기
with open("memo.txt", "a", encoding="utf-8") as f:
    f.write("새로운 한 줄 추가\n")

print("새로운 한 줄 추가 완료!")

# "r" 읽기 - read()는 전체를 한 번에
with open("memo.txt", "r", encoding="utf-8") as f:
    text = f.read()

print(text)

# 정리
# "w" 새로 쓰기 - 기존 내용 덮어쓰기
# "r" 읽기 - 파일 내용 읽어오기
# "a" 이어 쓰기 - 기존 내용 뒤에 덧붙이기
