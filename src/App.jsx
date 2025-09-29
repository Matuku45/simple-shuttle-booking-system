import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-3xl font-bold underline text-white">
        Hello, Tailwind 4!
      </h1>
    </div>
    </>
  )
}

export default App
