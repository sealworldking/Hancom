colors=["red","green","blue"]
# 순서있음, 수정가능, 중복허용

# print(colors[0])
# -> red가 출력된다.

# print(colors[-1])
# -> blue 가 출력된다.

# print(colors[0:2])
# red, green만 출력된다. 마지막 인덱스 -1 까지의 값이 출려되는 것.

# colors[-1]="black"
# print(colors[0:3])
# -> red, green, black이 뜬다. 즉, 값이 바뀐 것.

# colors.append("pink")
# print(colors)
# -> 뒷부분에 배열 하나 더 추가 후 pink를 넣는다.

# colors.insert(0, "White")
# print(colors)
# -> 맵 앞에 White가 추가된다.

# colors.remove("red")
# print(colors)
# -> greeen, blue 만 뜬다. red가 삭제된 것.

numbers = [8, 5, 3, 2, 7]
# numbers.sort()
# -> 오름차순으로 정렬한다.
# print(numbers)
# -> 2, 3, 5, 7, 8 출력됨

# numbers.sort(reverse=True)
# -> 내림차순 정렬
# print(numbers)
# -> [8, 7, 5, 3, 2] 출력됨

# print(2 in numbers)
# -> 2가 배열에 있는가? 이므로 출력은 True.

# print(9 in numbers)
# False