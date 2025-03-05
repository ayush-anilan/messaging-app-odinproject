import React, { useState } from 'react'
import Logo from '../../assets/logo.png'
import SideImage from '../../assets/sideimage.png'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        if (profilePic) {
            formData.append('profilePicture', profilePic);
        }

        try {
            const response = await api.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            alert("User registered successfully");

            // Optional: Store profile picture URL
            if (response.data.profilePicture) {
                console.log("Profile Picture URL:", response.data.profilePicture);
            }

            navigate("/login");
        } catch (error) {
            console.log(error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className='flex h-screen'>
            <div className='left-side bg-[#8722be] w-2/5 flex flex-col justify-center items-center min-h-screen max-lg:w-full max-xl:w-1/2'>
                <div className='logo flex justify-start items-center w-2/3 -ml-8 max-lg:w-full max-lg:flex max-lg:justify-center'>
                    <img src={Logo} alt="" className='h-28 max-lg:h-32' />
                    <p className='font-semibold text-6xl max-lg:text-8xl mt-2 -ml-3 text-white font-teko'>ChatWave</p>
                </div>
                <div className='w-2/3 pl-5 max-lg:w-full max-lg:flex flex-col max-lg:justify-start max-lg:pl-8 items-start text-white'>
                    <p className='font-semibold text-3xl'>Register your account?</p>
                    <div className='flex'>
                        <p className='font-medium'>Have a ChatWave account?</p>
                        <Link to={'/login'} className='text-[#fdd631] font-medium pl-1'>
                            Login
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='w-2/3 max-lg:w-full max-lg:px-8 flex flex-col gap-5 mt-5'>
                    <div className='flex flex-col'>
                        <label htmlFor="username" className='font-semibold text-lg text-white'>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="username" className='h-10 border rounded-md focus:outline-[#8722be] pl-2 text-base' required />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="password" className='font-semibold text-lg text-white'>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" className='h-10 rounded-md focus:outline-[#8722be] pl-2 text-base' required />
                    </div>
                    <div>
                        <label htmlFor="profile_pic" className="block font-semibold text-lg text-white">
                            Profile Picture
                        </label>
                        <div className="mt-1">
                            <input
                                id="profile_pic"
                                name="profile_pic"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className='bg-[#fdd631] text-center rounded-md'>
                        <button className='bg-[#fdd631] h-10 rounded-md text-lg font-semibold'>Sign up</button>
                    </div>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
            <div className='right-side w-3/4 flex justify-center min-h-screen max-lg:hidden max-xl:w-1/2'>
                <img src={SideImage} alt="" className='h-screen' />
            </div>
        </div>
    )
}

export default Register