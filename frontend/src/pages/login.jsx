// Login.js
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-96 bg-white p-8 rounded shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Login</h2>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-600'>
            Email:
          </label>
          <input
            type='text'
            id='email'
            className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='block text-gray-600'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button
          className='w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 focus:outline-none'
          onClick={handleSubmit}
        >
          Login
        </button>

        <p className='text-gray-800 text-sm my-1 text-center'>
          Don&apos;t have an Account?{" "}
          <Link to='/sign-up' className='text-indigo-700'>
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
