import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserGroups from "../components/UserGroups";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 max-w-2xl gap-12 my-12'>
          <Link
            to='/join-group'
            className='bg-white p-4 rounded shadow text-center'
          >
            <h3 className='text-lg font-semibold mb-4'>Join a Group?</h3>
          </Link>
          <Link
            to='/create-group'
            className='bg-white p-4 rounded shadow text-center'
          >
            <h3 className='text-lg font-semibold mb-4'>Create a Group?</h3>
          </Link>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-4'>Your Groups</h3>
          <UserGroups />
        </div>
      </div>
    </div>
  );
};

export default Home;
