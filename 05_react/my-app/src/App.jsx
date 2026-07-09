import Badge from './components/23/Badge.jsx'

function App(){
  return (
    <>
    <h1 style={{ color: "black" }}>삼항 연산자 조건식 ? True : False</h1>
      <Badge text="안녕하세요 이것은 true입니다." type="new"/>
      <Badge text="안녕하세요 이것은 false입니다." type="not"/>
    </>
  )
}

export default App

// ===== 이전 연습 코드 (보관용) =====

// --- 22 Avatar ---
// import './App.css'
// import Avatar from './components/22/Avatar'
//
// function App() {
//   return (
//     <>
//       <Avatar name="김대진" online={true}/>
//     </>
//   )
// }
//
// export default App

// --- 21 Card ---
// import './App.css'
// import Card from './components/21/Card.jsx'
//
// function App() {
//   return (
//     <>
//       <Card title="React 고수되기" desc="기초부터 차근차근" emoji="⭐" />
//     </>
//   )
// }
//
// export default App

// --- 20 Profile ---
// import './App.css'
// import Profile from './components/20/Profile.jsx'
//
// function App() {
//   return (
//     <>
//       <Profile name="고양이" job="웹 프론트" />
//     </>
//   )
// }
//
// export default App

// --- 19 Greeting ---
// import './App.css'
// import Greeting from './components/19/Greeting.jsx'
//
// function App() {
//   return (
//     <>
//       <Greeting />
//     </>
//   )
// }
//
// export default App

// --- 18 Hello ---
// import './App.css'
// import Hello from './components/Hello.jsx'
//
// function App() {
//   return (
//     <>
//     <Hello name="철수"/>
//     </>
//   )
// }
//
// export default App
