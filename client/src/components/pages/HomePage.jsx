import React, { useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import api from '../../services/api';
import { ChevronDown, Send, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const userName = localStorage.getItem('username');
    const userId = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [activeChat, setActiveChat] = useState("Chat");
    const [selectedFriend, setSelectedFriend] = useState(null);

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
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };

        const fetchFriends = async () => {
            try {
                const response = await api.get('/users');
                const filteredFriends = response.data.filter(friend => friend.username !== userName);
                setFriends(filteredFriends);
            } catch (error) {
                console.error("Error fetching friends list:", error);
            }
        };

        if (userName) {
            fetchProfilePic();
            fetchFriends();
        }
    }, [userName, userId]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleChatSelection = (name) => {
        setActiveChat(name);
        setSelectedFriend(name);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white flex flex-col">
                <div className="p-4 flex items-center gap-2 border-b border-gray-700">
                    <img src={Logo} alt="Logo" className="h-12" />
                    <h1 className="text-2xl font-bold">ChatWave</h1>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <h2 className="text-lg font-semibold p-4">Friends</h2>
                    <ul className="space-y-2 px-4">
                        {friends.map((friend) => (
                            <li
                                key={friend.id}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedFriend === friend.username ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                onClick={() => handleChatSelection(friend.username)}
                            >
                                <img src={friend.profilePicture} alt={friend.username} className="w-8 h-8 rounded-full" />
                                <span>{friend.username}</span>
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-lg font-semibold p-4 mt-6">Global Chat</h2>
                    <div className="px-4">
                        <div
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedFriend === "Global Chat Room" ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => handleChatSelection("Global Chat Room")}
                        >
                            <Globe />
                            <span>Global Chat Room</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full" />
                        <span>{userName}</span>
                        <ChevronDown />
                    </div>
                    {dropdownOpen && (
                        <div className="bg-gray-700 rounded mt-2 p-2">
                            <div className="p-2 cursor-pointer hover:bg-gray-600" onClick={handleLogout}>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Screen */}
            <div className="w-3/4 bg-gray-100 flex flex-col">
                <div className="p-4 bg-white shadow flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{activeChat}</h2>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Start New Chat</button>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    {/* Chat messages will be rendered here */}
                </div>

                <div className="p-4 bg-white shadow flex items-center">
                    <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded p-2 mr-2"
                        placeholder="Type a message..."
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        <Send />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
