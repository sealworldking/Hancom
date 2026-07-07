const IMG_A = "https://picsum.photos/96?random=1";
const IMG_B = "https://picsum.photos/96?random=2";
const IMG_C = "https://picsum.photos/96?random=3";
const IMG_D = "https://picsum.photos/96?random=4";

const myImage=document.querySelector("#pic");
// pic 의 src 값을 IMG_A로 초깃값을 정해줌.
myImage.setAttribute("src",IMG_A);
// 클릭 이벤트를 처리하는 다른 방법들 중 하나.
myImage.onclick=()=>{
  const mySrc=myImage.getAttribute("src");
// 현재꺼가 A면 B로
  if(mySrc===IMG_A){
    myImage.setAttribute("src",IMG_B);
  }
// 현재꺼가 B면 C로
  else if(mySrc===IMG_B){
    myImage.setAttribute("src",IMG_C);
  }
// 현재꺼가 C면 D로
  else if(mySrc===IMG_C){
    myImage.setAttribute("src",IMG_D);
  }
// 현재꺼가 D면 다시 A로
  else{
    myImage.setAttribute("src",IMG_A);
  }
};