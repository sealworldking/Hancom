from termcolor import colored
def highlight(text:str, color:str)->str:
    """
    color:str
    """
    color_text=colored(text, color)
    return color_text

# return은 값을 돌려주기만 함. 화면에 찍으려면 print가 필요
print(highlight("GOOD", "yellow"))