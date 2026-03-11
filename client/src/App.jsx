import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <div className="p-20 text-3xl">
      {message}
    </div>
  )
}

export default App