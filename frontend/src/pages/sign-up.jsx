import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 rounded shadow-md p-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign up for an account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <input
            name='name'
            type='text'
            required
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            className='block w-full p-3 border border-gray-300 rounded mb-4'
          />
          <input
            name='email'
            type='email'
            required
            value={formData.email}
            onChange={handleChange}
            placeholder='Email address'
            className='block w-full p-3 border border-gray-300 rounded mb-4'
          />
          <input
            name='phoneNumber'
            type='tel'
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder='Phone number'
            className='block w-full p-3 border border-gray-300 rounded mb-4'
          />
          <input
            name='password'
            type='password'
            required
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='block w-full p-3 border border-gray-300 rounded mb-4'
          />
          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Sign up
            </button>
          </div>
        </form>
        <p className='text-gray-800 text-sm my-1 text-center'>
          Already have an Account?{" "}
          <Link to='/login' className='text-indigo-700'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
