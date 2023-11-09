// Login.js
import { useState } from "react";
import axios from "axios";

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
      // Handle successful login
    } catch (error) {
      console.error(error.response.data);
      // Handle login error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name='email'
          type='email'
          required
          value={formData.email}
          onChange={handleChange}
          placeholder='Email'
        />
        <input
          name='password'
          type='password'
          required
          value={formData.password}
          onChange={handleChange}
          placeholder='Password'
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
