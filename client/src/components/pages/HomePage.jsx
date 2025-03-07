import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaSearch, FaPaperPlane, FaChevronDown, FaChevronUp, FaPaperclip } from "react-icons/fa";
import io from "socket.io-client";
import ChatSideBar from "../ChatSideBar";
import api from "../../services/api";

const socket = io("http://localhost:4000"); // Connect to backend

const HomePage = () => {
    const userName = localStorage.getItem("username");
    const userId = localStorage.getItem("userid"); // Get user ID for sending messages
    const profilePicture = localStorage.getItem("profilePicture");
    const chatEndRef = useRef(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]); // Store chat messages
    const [file, setFile] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState({});

    useEffect(() => {

        socket.on("receiveMessage", (newMessage) => {
            if (
                (newMessage.sender === userId && newMessage.receiver === selectedUser?._id) ||
                (newMessage.sender === selectedUser?._id && newMessage.receiver === userId)
            ) {
                // If chatting, show message immediately
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                // If not chatting, increase unread count
                setUnreadMessages((prev) => ({
                    ...prev,
                    [newMessage.sender]: (prev[newMessage.sender] || 0) + 1
                }));
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedUser, userId, messages]);



    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear previous messages

        try {
            const response = await api.get(`/messages/${userId}/${user._id}`);
            setMessages(response.data);

            // Reset unread messages count
            setUnreadMessages((prev) => ({
                ...prev,
                [user._id]: 0
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() || file) {
            const newMessage = { sender: userId, receiver: selectedUser._id, message, file, timestamp: new Date().toISOString() };

            socket.emit("sendMessage", newMessage); // Only send to the server

            setMessage(""); // Clear input field
            setFile(null);
        }
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r relative">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <FaComments className="text-orange-500 text-2xl" />
                        <span className="ml-2 text-xl font-bold text-orange-500">Chat Wave</span>
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                            <img
                                src={profilePicture || "https://placehold.co/40x40"}
                                alt="User avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <p>{userName}</p>
                            {isDropdownOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <input type="text" placeholder="Search" className="w-full p-2 pl-10 border rounded-full focus:outline-none" />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>
                <div className="p-4">
                    <ChatSideBar onSelectUser={handleSelectUser} unreadMessages={unreadMessages} />
                </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    {selectedUser ? (
                        <div className="flex items-center">
                            <img
                                src={selectedUser.profilePicture || "https://placehold.co/40x40"}
                                alt="User avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4">
                                <div className="font-bold">{selectedUser.username}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="font-bold text-gray-500">Select a friend to chat</div>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index}
                            className={`mb-2 p-3 rounded-lg max-w-xs text-lg font-bold
            ${msg.sender === userId ? "bg-orange-500 text-white self-end ml-auto text-end" :
                                    "bg-gray-200 text-black mr-auto"}`}>

                            {msg.message && <p>{msg.message}</p>}
                            {msg.file && <img src={msg.file} alt="File" className="w-20 h-20 rounded-lg mt-2" />}
                            {/* Message Timestamp */}
                            <span className="text-xs text-gray-300 block mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>

                    {file && (
                        <div className="mb-2 p-2 border rounded-lg bg-gray-100 flex items-center">
                            {file.type.startsWith("image/") ? (
                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 rounded-lg mr-2" />
                            ) : (
                                <span className="text-sm">{file.name}</span>
                            )}
                            <button onClick={() => setFile(null)} className="ml-2 text-red-500 text-sm">
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t flex items-center bg-white">
                    <input
                        type="text"
                        placeholder="Type here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-full focus:outline-none"
                    />

                    <label htmlFor="fileUpload" className="ml-4 p-2 cursor-pointer text-gray-500">
                        <FaPaperclip />
                    </label>
                    <input type="file" id="fileUpload" onChange={handleFileChange} className="hidden" />

                    <button onClick={handleSendMessage} className="ml-4 p-2 bg-orange-500 text-white rounded-full">
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
