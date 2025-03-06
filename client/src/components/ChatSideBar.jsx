import React, { useEffect, useState } from "react";
import api from "../services/api";

const ChatSideBar = ({ onSelectUser, unreadMessages }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user
    const loggedInUserId = localStorage.getItem("userid");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");
                const filteredUsers = response.data.filter(user => user._id !== loggedInUserId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [loggedInUserId]);

    const handleUserClick = (user) => {
        setSelectedUserId(user._id); // Update selected user ID
        onSelectUser(user); // Pass the user to the parent component
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Friends</h3>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user._id} onClick={() => handleUserClick(user)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition cursor-pointer
    ${selectedUserId === user._id ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`}>

                        <img src={user.profilePicture || "https://placehold.co/40x40"} alt={user.username}
                            className="w-10 h-10 rounded-full border" />

                        <span className="font-medium">{user.username}</span>

                        {/* Show unread message count if there are unread messages */}
                        {unreadMessages[user._id] > 0 && (
                            <span className="ml-auto bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                                {unreadMessages[user._id]}
                            </span>
                        )}
                    </li>

                ))}

            </ul>
        </div>
    );
};

export default ChatSideBar;
