import React, { useState } from 'react';
import Logo from '../../assets/logo.png';
import SideImage from '../../assets/sideimage.png';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            alert("User logged in successfully");
            console.log(response);
            localStorage.setItem('userid', response.data.id);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem("profilePicture", response.data.profilePicture)
            navigate("/homepage");
        } catch (error) {
            console.error(error);

            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className='flex h-screen'>
            <div className='left-side bg-gray-800 w-2/5 flex flex-col justify-center items-center min-h-screen max-lg:w-full max-xl:w-1/2'>
                <div className='logo flex justify-start items-center w-2/3 -ml-8 max-lg:w-full max-lg:flex max-lg:justify-center'>
                    <img src={Logo} alt="" className='h-28 max-lg:h-32' />
                    <p className='font-semibold text-6xl max-lg:text-8xl mt-2 -ml-3 text-white font-teko'>ChatWave</p>
                </div>
                <div className='w-2/3 pl-5 max-lg:w-full max-lg:flex flex-col max-lg:justify-start max-lg:pl-8 items-start text-white'>
                    <p className='font-semibold text-3xl'>Welcome</p>
                    <div className='flex'>
                        <p className='font-medium'>New to ChatWave?</p>
                        <Link to={'/register'} className='text-[#fdd631] font-medium pl-1'>
                            Create an account
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='w-2/3 max-lg:w-full max-lg:px-8 flex flex-col gap-5 mt-5'>
                    <div className='flex flex-col'>
                        <label htmlFor="username" className='font-semibold text-lg text-white'>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="username" className='h-10 border rounded-md focus:outline-[#8722be] pl-2 text-base' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="password" className='font-semibold text-lg text-white'>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" className='h-10 rounded-md focus:outline-[#8722be] pl-2 text-base' />
                    </div>
                    {error && <div className='text-red-500'>{error}</div>}
                    <div className='bg-[#fdd631] text-center rounded-md'>
                        <button className='bg-[#fdd631] h-10 rounded-md text-lg font-semibold'>Sign in</button>
                    </div>
                </form>
            </div>
            <div className='right-side w-3/4 flex justify-center min-h-screen max-lg:hidden max-xl:w-1/2'>
                <img src={SideImage} alt="" className='h-screen' />
            </div>
        </div>
    );
};

export default Login;
