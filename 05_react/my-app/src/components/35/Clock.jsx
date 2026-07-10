// React에서 도구 2개를 빌림.
import{useState, useEffect} from "react";

// Clock 부품 만들기 시작
const Clock=()=>{
    const [time, setTime]=useState(new Date().toLocaleTimeString())

    useEffect(()=>{
        const timer=setInterval(()=>{
            setTime(new Date().toLocaleTimeString())
        }, 1000)
        // clean-up함수. 컴포넌트가 사라질 때 켜둔 타이머를 끄는 명령어이다.
        return ()=>clearInterval(timer)
        // 처음 한 번만 타이머를 키도록 하는 코드
    }, [])
    // time 바뀔 때마다 다시 그리는 코드
    return <p>{`🕛 => ${time}`}</p>
}

export default Clock