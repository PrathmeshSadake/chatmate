import { useState } from "react";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-1 overflow-y-scroll p-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className='bg-gray-200 p-4 flex items-center'>
        <input
          type='text'
          className='flex-1 py-2 px-4 border rounded-full mr-2'
          placeholder='Type your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-full'
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;