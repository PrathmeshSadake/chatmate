import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/groups/${user.userId}`
        );
        console.log("User Groups", data);
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <div className='container mx-auto mt-8'>
      {groups.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {groups.map((group) => (
            <Link
              to={`/chat/${group.usergroup.groupId}`}
              key={group.id}
              className='bg-white w-full p-4 rounded shadow'
            >
              {group.usergroup.isAdmin && (
                <p className='text-xs text-indigo-400 font-semibold'>Admin</p>
              )}
              <h3 className='text-xl font-semibold'>{group.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className='bg-white p-4 rounded shadow text-center'>
          <h3 className='text-lg font-semibold mb-4'>No groups created yet!</h3>
          <Link
            to='/create-group'
            className='bg-indigo-700 p-2 text-white text-sm'
          >
            Create a new group
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserGroups;
