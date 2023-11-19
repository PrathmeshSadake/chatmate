import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  const handleCreateGroup = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatmatejwt="))
      ?.split("=")[1];

    try {
      const response = await axios.post(
        "http://localhost:3001/api/groups",
        {
          name: groupName,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log(response);
      toast.success("Group created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='container mx-auto mt-8'>
        <div className='max-w-md mx-auto bg-white p-8 rounded shadow'>
          <h2 className='text-2xl font-semibold mb-4'>Create a New Group</h2>

          <div className='mb-4'>
            <label
              htmlFor='groupName'
              className='block text-sm font-medium text-gray-600'
            >
              Group Name
            </label>
            <input
              type='text'
              id='groupName'
              className='mt-1 p-2 border rounded w-full'
              placeholder='Enter group name'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <button
            className='bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600'
            onClick={handleCreateGroup}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
