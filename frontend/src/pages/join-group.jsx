import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const JoinGroupByName = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleJoinGroup = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatmatejwt="))
      ?.split("=")[1];
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/groups/join-group-by-name`,
        {
          groupName,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Joined the group successfully");
        navigate("/");
      } else {
        toast.error("Error joining group");
      }
    } catch (error) {
      console.error(error);
      setError("Internal Server Error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Join Group by Name</h2>
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            placeholder='Enter group name'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className='border rounded p-2'
          />
          <button
            onClick={handleJoinGroup}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Join Group
          </button>
        </div>
        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </div>
    </div>
  );
};

export default JoinGroupByName;
