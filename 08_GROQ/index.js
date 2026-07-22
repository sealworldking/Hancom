require('dotenv').config()
const key=process.env.GROQ_API_KEY

const main=async()=>{
    const groqRes=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        body:JSON.stringify({
            model:'llama-3.1-8b-instant',
            messages:[{role:"user",content:"Grok 회사에 대해 알려줘."}]
        })
    })
    const data=await groqRes.json()
    // 물음표를 쓰는 이유: 응답이 없어도 에러를 안내기 위해서.
    console.log(data.choices?.[0]?.message?.content||data)
}
// 여기입니다.
main()