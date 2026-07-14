const express=require("express") // 1. 꺼내기
const app=express() // 2. 만들기
app.use(express.json())

let users = [
    {id:1, name:"JINI"},
    {id:2, name:"KIM"}
]

// 3. 규칙 만들기
app.put('/api/users/:id',(req,res)=>{
    const u=users.find(u=>u.id===Number(req.params.id))
    if(!u) return res.status(404).json({error:"없는 유저입니다."})
    u.name=req.body.name
    res.json(u)
})

// 4. 문열기
app.listen(3005, async()=>{
    const res=await fetch("http://localhost:3005/api/users/1", {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:"한컴"})
    })
    console.log(await res.json()) //바뀐 결과 확인
})