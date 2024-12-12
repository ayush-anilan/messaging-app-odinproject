import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Users = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const userId = localStorage.getItem('userid');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                console.log(response);
                const filteredUsers = response.data.filter(user => user._id !== userId);
                setUsers(filteredUsers);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [userId]);

    return (
        <div className='m-5'>
            <h1 className='font-semibold text-2xl text-gray-900'>Users</h1>
            <div className='mt-5 max-h-[400px] overflow-y-auto'>
                {/* Public Chat Room */}
                <div
                    className='flex items-center rounded-xl gap-3 mt-2 border p-5 bg-[#8722be] hover:bg-gray-500 cursor-pointer'
                    onClick={() => onSelectUser(null)} // Indicate public chat room selection
                >
                    <img src="/path/to/public-chat-icon.png" alt="Public Chat Room" className='border rounded-full w-12 h-12' />
                    <p className='text-white font-semibold text-xl'>Public Chat Room</p>
                </div>

                {/* List of Users */}
                {users && (
                    users.map(user => (
                        <div
                            key={user._id}
                            className='flex items-center rounded-xl gap-3 mt-2 border p-5 bg-[#8722be] hover:bg-gray-500 cursor-pointer'
                            onClick={() => onSelectUser(user)}
                        >
                            {user.profilePicture && (
                                <img src={user.profilePicture} alt={`${user.username}'s profile`} className='border rounded-full w-12 h-12' />
                            )}
                            <p className='text-white font-semibold text-xl'>{user.username}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Users;
