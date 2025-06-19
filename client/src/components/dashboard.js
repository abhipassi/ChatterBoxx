import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    try {
      axios.get('http://localhost:4000/getUsers').then((res) => setUserList(res.data))
    } catch (error) {
      console.log(error)
    }
  }, [])

   let logout = () =>{
     try {
       axios.get('http://localhost:4000/logout')
       .then((res) =>{
        console.log(res.data);
        
       })
     } catch (error) {
       console.log(error)
     }
   }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-colorThree">Chatterbox</h1>
        <input type="button" value="Logout" className="bg-colorThree text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition" onClick={logout}/>
      </header>

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <ul className="space-y-3">
            {userList &&
              userList.map((user) => (
                <li
                  className='p-3 rounded-lg cursor-pointer transition bg-colorThree text-white  hover:text-white'>
                  {user.username}
                </li>
              ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-colorThree">
              Group Chat
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            
              <>
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow text-sm max-w-xs">
                    hii
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-colorThree text-white p-3 rounded-lg shadow text-sm max-w-xs">
                    Hello! How are you?
                  </div>
                </div>
              </>
          
         
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-colorThree"
            />
            <button className="bg-colorThree text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
              Send  
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

