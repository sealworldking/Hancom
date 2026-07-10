import {useState} from "react";

const NameForm=()=>{
    // 글자 보관, 처음은 빈 문자열''
    const[name, setName]=useState("")
    return (
        <>
        <input
        // 칸에 보일 값
            value={name}
            // 새로운 글자를 칠 때마다 갱신하도록 하는 코드.
            onChange={(e)=>setName(e.target.value)}
        />
        {/* 이 글자도 자동 갱신임. */}
        <p>안녕, {name}!</p>
        </>
    )
}

export default NameForm