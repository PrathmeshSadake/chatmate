import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ChatScreen = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/groups/group/${groupId}`
        );
        setGroup(response.data || null);
      } catch (error) {
        console.error("Error fetching group:", error);
        setGroup(null);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleSendMessage = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatmatejwt="))
      ?.split("=")[1];

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${groupId}`,
        {
          text: newMessage,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatmatejwt="))
      ?.split("=")[1];
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${groupId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col h-screen'>
      <nav className='bg-indigo-700 p-2'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link to='/' className='text-white text-xl font-bold'>
            Back to home
          </Link>

          <h2 className='text-white text-xl font-bold'>Group: {group.name}</h2>
        </div>
      </nav>

      <div className='flex-1 overflow-y-scroll p-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.userId === user.userId ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                message.userId === user.userId
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

export default ChatScreen;
