def meters_to_feet(meters):
    feet=meters*3.2804
    return feet

# 사용자 입력
user_input=input("미터 값을 입력해주세요: ")

# 예외 처리
try:
    # input() 결과는 무조건 문자열을 반환하기 때문에, 올바르게 계산하려면 숫자로 바꿔야 한다. = float()
    meters=float(user_input)
    feet=meters_to_feet(meters)
    print(f"{meters}m는 {feet}ft 입니다.")
except ValueError:
    print("숫자를 입력해주세요.")