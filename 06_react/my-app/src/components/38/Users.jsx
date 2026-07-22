import { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("데이터 로딩 실패: ", error))
  }, [])

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} ({u.company.name})
        </li>
      ))}
    </ul>
  )
}

export default Users
