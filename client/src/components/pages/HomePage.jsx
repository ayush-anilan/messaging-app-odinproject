import React, { useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import api from '../../services/api';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const userName = localStorage.getItem('username');
    const userId = localStorage.getItem('userid');
    const navigate = useNavigate()
    const [profilePicture, setProfilePicture] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editUserName, setEditUserName] = useState(userName);
    const [editProfilePicture, setEditProfilePicture] = useState(profilePicture);

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await api.get(`/users/profile-picture/${userId}`, {
                    responseType: 'arraybuffer'
                });
                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setProfilePicture(`data:image/png;base64,${base64String}`);
                setEditProfilePicture(`data:image/png;base64,${base64String}`);
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };
        if (userName) {
            fetchProfilePic();
        }
    }, [userName, userId]);

    const handleLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('userid')
        navigate('/login')
    };

    const handleAccountSettings = () => {
        setModalOpen(true);
    };

    const handleSaveChanges = async () => {
        // Implement save functionality here
        console.log("Saving changes...");

        try {
            const formData = new FormData();
            formData.append('username', editUserName);
            if (editProfilePicture !== profilePicture) {
                const response = await fetch(editProfilePicture);
                const blob = await response.blob();
                formData.append('profilePicture', blob);
            }

            await api.put(`/users/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            localStorage.setItem('username', editUserName);
            setProfilePicture(editProfilePicture);
            setModalOpen(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditProfilePicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='bg-[#8722be] h-screen'>
            <div className='logo flex justify-between border items-center w-full  max-lg:w-full max-lg:flex max-lg:justify-center'>
                <div className='flex items-center'>
                    <img src={Logo} alt="" className='h-28 max-lg:h-32' />
                    <p className='font-semibold text-6xl max-lg:text-8xl mt-2 -ml-3 text-white font-teko'>ChatWave</p>
                </div>
                <div className='relative'>
                    <div className='flex items-center gap-2 mr-10 cursor-pointer' onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={profilePicture} alt="" className='w-14 h-14 border-4 rounded-full' />
                        <div className='flex items-center gap-1'>
                            <p className='text-xl font-semibold text-white'>{userName}</p>
                            <ChevronDown className='text-white ' />
                        </div>
                    </div>
                    {dropdownOpen && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
                            <p className='block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer' onClick={handleAccountSettings}>Account Settings</p>
                            <p className='block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer' onClick={handleLogout}>Logout</p>
                        </div>
                    )}
                </div>
            </div>
            <div className='border'>
                <p>Users</p>
            </div>

            {modalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-md w-1/3'>
                        <h2 className='text-2xl font-bold mb-4'>Account Settings</h2>
                        <div className='flex flex-col items-center'>
                            <img src={editProfilePicture} alt="Profile" className='w-24 h-24 rounded-full mb-4' />
                            <input type='file' accept='image/*' onChange={handleFileChange} className='mb-4' />
                            <input
                                type='text'
                                value={editUserName}
                                onChange={(e) => setEditUserName(e.target.value)}
                                className='border p-2 rounded w-full mb-4'
                            />
                            <div className='flex justify-end w-full'>
                                <button onClick={() => setModalOpen(false)} className='bg-gray-500 text-white px-4 py-2 rounded mr-2'>Cancel</button>
                                <button onClick={handleSaveChanges} className='bg-blue-500 text-white px-4 py-2 rounded'>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
