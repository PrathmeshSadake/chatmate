import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (user) {
    return <Navigate to='/' />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        formData
      );

      if (response.status === 200) {
        const { token } = response.data;
        document.cookie = `chatmatejwt=${token}; path=/`;
        login(token);
        console.log("User logged in successfully");
      } else {
        console.error("Failed to log in");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-96 bg-white p-8 rounded shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-600'>
              Email:
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-600'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500'
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none'
          >
            Login
          </button>
        </form>
        <p className='text-gray-800 text-sm my-1 text-center'>
          Don&apos;t have an Account?{" "}
          <Link to='/login' className='text-indigo-700'>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
