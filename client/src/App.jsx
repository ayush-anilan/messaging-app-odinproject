import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import HomePage from './components/pages/HomePage'
import RequireAuth from './components/RequireAuth'


function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/homepage' element={<RequireAuth>
            <HomePage />
          </RequireAuth>} />
        </Routes>

      </Router>
    </>
  )
}

export default App
