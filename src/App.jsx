import { useState } from 'react'
import './App.css'
import About from './pages/About.jsx';
import AdminDashboard from './pages/AdminDashboard';
import  Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PassengerDashboard from './pages/PassengerDashboard.jsx';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-3xl font-bold underline text-white">
        Hello, Tailwind 4!
      </h1>


    </div>

  <AdminDashboard/>
    </>
  )
}

export default App
