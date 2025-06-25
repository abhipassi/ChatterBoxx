import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const socketRef = useRef();
  const navigate = useNavigate();

  // fetch current username 
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/tokenName`, { withCredentials: true })
      .then(res => {
        setUsername(res.data);
      })
      .catch(err => {
        console.error('Error fetching username:', err);
      });
  }, []);

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL);

    // Fetch users
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/getUsers` , { withCredentials: true })
      .then((res) => {
        setUserList(res.data);
      })
      .catch((error) => console.log(error));

    // Listen for incoming messages
    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect()
    };
  }, []);

  const sendMessage = () => {
    if (currentMessage.trim() === '') return;

    const messageData = {
      sender: username,
      message: currentMessage,
    };

    socketRef.current.emit('send_message', messageData);
    setCurrentMessage('');
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/getMessages`, { withCredentials: true })
    .then((res) => {
      setMessages(res.data);
    });
  }, []);


  const logout = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => console.log(error));
    navigate('/')
  };


  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-colorThree">Chatterbox</h1>
        <input
          type="button"
          value="Logout"
          className="bg-colorThree text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          onClick={logout}
        />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <ul className="space-y-3">
            {userList.map((user, index) => (
              <li key={index} className="p-3 rounded-lg cursor-pointer transition bg-colorThree text-white hover:text-white">
                {user.username}
              </li>
            ))}
          </ul>
        </aside>
        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-colorThree">Group Chat</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg shadow text-sm max-w-xs ${msg.sender === username ? 'bg-colorThree text-white' : 'bg-white'
                    }`}
                >
                  <span className="block font-semibold text-xs text-black">{msg.sender}</span>
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>

          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-colorThree"
            />
            <button
              onClick={sendMessage}
              className="bg-colorThree text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

