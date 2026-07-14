const express=require("express") //1. 꺼내기
const app=express() //2. 만들기

const users=[
    {id:1, name:"KIM"},
    {id:2, name:"LEE"},
    {id:3, name:"CHOI"}
]

// 3. 규칙 만들기
app.get('/api/users/:id',(req,res)=>{
    const user=users.find(u=>u.id===Number(req.params.id))
    if(!user) return res.status(404).json({error:'없는 유저'})
    res.json(user)
})

// 4. 문열기
app.listen(3000,()=>console.log("http://localhost:3000"))