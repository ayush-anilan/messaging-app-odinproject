import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import HomePage from './components/pages/HomePage'
import RequireAuth from './components/RequireAuth'
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/homepage' element={<RequireAuth>
            <HomePage socket={socket} />
          </RequireAuth>} />
        </Routes>

      </Router>
    </>
  )
}

export default App
