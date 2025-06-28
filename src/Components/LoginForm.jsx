import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../Services/authroute';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);  // ✅ Loading state

  const handleFormSubmit = async (data) => {
    console.log('Login data:', data);
    setLoading(true);  // ✅ Disable button while calling API

    try {
      const res = await api.post("/login", data);
      console.log("Login response:", res.data);
      toast.success(`Login Successful! Welcome ${res.data.user.name}`);

      localStorage.setItem('authToken', res.data.user.authtoken);
      localStorage.setItem('userEmail', res.data.user.email);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error('Wrong Credentials. Try Again!');
    } finally {
      setLoading(false);  // ✅ Re-enable button after API response
    }
  };

  return (
    <div className="space-y-6 p-6 rounded-xl shadow-md bg-white/10 backdrop-blur-md border border-white/20">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Email Address
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border border-gray-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Password
        </label>
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border border-gray-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* ✅ Submit Button */}
      <button
        onClick={handleSubmit(handleFormSubmit)}
        disabled={loading}  // ✅ Button disabled while loading
        className={`w-full py-3 px-4 rounded-md ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
        } text-white transition duration-300`}
      >
        {loading ? "Logging in..." : "Sign In"}  {/* ✅ Button text change */}
      </button>
    </div>
  );
};

export default LoginForm;
