import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

function App(){
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
        {' | '}
        <Link to="/Contact">Contact</Link>
      </nav>

      {/* 주소에 맞는 화면을 여기서 그림 */}
      <Routes>
        <Route path="/" element={<Home />} />        {/* 주소가 / 면 Home */}
        <Route path="/about" element={<About />} />   {/* 주소가 /about 면 About */}
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

// ===== 이전 연습 코드 (보관용) =====

// --- 39 Weather ---
// import './App.css'
// import Weather from './components/39/Weather.jsx'
//
// function App(){
//   return(
//     <>
//     <Weather/>
//     </>
//   )
// }
//
// export default App

// --- 38 Users (fetch 데이터 가져오기) ---
// import './App.css'
// import Users from './components/38/Users.jsx'
//
// function App(){
//   return(
//     <>
//     <Users/>
//     </>
//   )
// }
//
// export default App

// --- 37 Every (의존성 배열 없음 = 매 렌더) ---
// import './App.css'
// import Every from './components/37/Every.jsx'
//
// function App(){
//   return(
//     <>
//     <Every/>
//     </>
//   )
// }
//
// export default App

// --- 36 Counter ---
// import './App.css'
// import Counter from './components/36/Counter'
//
// function App(){
//   return(
//     <>
//       <Counter/>
//     </>
//   )
// }
//
// export default App

// --- 35 Clock (useEffect + clean-up) ---
// import './App.css'
// import Clock from './components/35/Clock'
//
// function App(){
//   return(
//     <>
//       <Clock/>
//     </>
//   )
// }
//
// export default App

// --- 34 Hello (useEffect []) ---
// import './App.css'
// import Hello from './components/34/Hello.jsx'
//
// function App(){
//   return (
//     <>
//       <Hello/>
//     </>
//   )
// }
//
// export default App

// --- 33 ProductItem (props + state) ---
// import './App.css'
// import ProductItem from './components/33/ProductItem.jsx'
//
// function App(){
//   return (
//   <>
//     <ProductItem name="나이키 운동화"/>
//   </>
//   )
// }
//
// export default App

// --- 32 NameForm (폼 입력) ---
// import './App.css'
// import NameForm from './components/32/NameForm.jsx'
//
// function App(){
//   return (
//     <>
//       <NameForm/>
//     </>
//   )
// }
//
// export default App

// --- 31 Counter (+1 / -1 / 리셋) ---
// import Counter from './components/31/Counter'
//
// function App(){
//   return (
//     <>
//       <Counter/>
//     </>
//   )
// }
//
// export default App

// --- 29 Counter (useState) ---
// import './App.css'
// import Counter from './components/29/Counter'
//
// function App(){
//   return (
//     <>
//     <Counter/>
//     </>
//   )
// }
//
// export default App

// --- 28 레이아웃 (Header/Menu/Content/Footer) ---
// import './App.css'
// import Header from './components/28/Header'
// import Menu from './components/28/Menu'
// import Content from './components/28/Content'
// import Footer from './components/28/Footer'
//
// function App(){
//   return (
//     <>
//       <Header />
//       <Menu />
//       <Content />
//       <Footer />
//     </>
//   )
// }
//
// export default App

// --- 27 SubmitButton (MUI) ---
// import SubmitButton from './components/27/SubmitButton'
//
// function App(){
//   return (
//     <>
//       <SubmitButton/>
//     </>
//   )
// }
//
// export default App

// --- 26 Tag ---
// import Tag from './components/26/Tag'
//
// function App(){
//     const list=["HTML", "CSS", "JS", "REACT"]   // 재료 배열, 통째로 넘김
//         return (
//             <>
//                 <Tag tags={list}/>
//             </>
//         )
// }
//
// export default App

// --- 25 Rating ---
// import './App.css'
// import Rating from './components/25/Rating'
//
// function App(){
//     return (
//         <>
//         <Rating score={3}/>
//         <Rating score={7}/>
//         <Rating score={2}/>
//         <Rating score={2}/>
//         </>
//     )
// }
//
// export default App

// --- 24 Alert ---
// import './App.css'
// import Alert from './components/24/Alert'
//
// function App(){
//     return (
//         <>
//             <Alert type="success" text="성공했습니다."/>
//             <Alert type="error" text="실패했습니다."/>
//             <Alert type="warning" text="주의하세요."/>
//         </>
//     )
// }
//
// export default App

// --- 23 Badge ---
// import Badge from './components/23/Badge.jsx'
//
// function App(){
//   return (
//     <>
//     <h1 style={{ color: "black" }}>삼항 연산자 조건식 ? True : False</h1>
//       <Badge text="안녕하세요 이것은 true입니다." type="new"/>
//       <Badge text="안녕하세요 이것은 false입니다." type="not"/>
//     </>
//   )
// }
//
// export default App

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
