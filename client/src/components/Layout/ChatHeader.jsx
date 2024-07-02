import React from 'react'
import Logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const ChatHeader = () => {
    const userName = localStorage.getItem('username')
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate('/login')
    }
    return (
        <nav className=' flex items-center justify-between border'>
            <div className='flex items-center'>
                <img src={Logo} alt="" className='h-28 max-lg:h-32' />
                <p className='font-semibold text-5xl max-lg:text-8xl mt-2 -ml-3 text-white font-teko'>ChatWave</p>
            </div>
            <div className='pr-5 flex gap-5 items-center'>
                <div>
                    <p className='font-teko text-white text-4xl'>{userName}</p>
                </div>
                <div>
                    <button className='bg-red-600 p-3 rounded-2xl text-white font-teko text-3xl' onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </nav>
    )
}

export default ChatHeader