import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useAuth();
  return (
    <nav className='bg-indigo-700 p-2'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-white text-xl font-bold'>
          Chatmate
        </Link>

        <div className='flex items-center space-x-4'>
          <span className='text-white'>Hello, {user.name}</span>
          <button
            onClick={logout}
            className='bg-white text-indigo-800 px-2 py-1'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
