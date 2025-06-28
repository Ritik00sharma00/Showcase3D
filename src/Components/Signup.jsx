import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../Services/authroute';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    mode: 'onChange'
  });

  const handleFormSubmit = async (data) => {
    console.log('Signup data:', data);
    try {
      const res = await api.post('/signup', data);
      console.log('Signup response:', res.data);
      toast.success('Account created successfully!');
      reset();
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 p-6 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/20 text-white w-full max-w-8xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                pattern: { value: /^[a-zA-Z\s]+$/, message: 'Only letters and spaces allowed' }
              })}
              type="text"
              placeholder="Your full name"
              className={`w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border ${errors.name ? 'border-red-400' : 'border-gray-500'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email format'
                }
              })}
              type="email"
              placeholder="Your email"
              className={`w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border ${errors.email ? 'border-red-400' : 'border-gray-500'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: 'Include uppercase, lowercase, number, special character'
                }
              })}
              type="password"
              placeholder="Strong password"
              className={`w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border ${errors.password ? 'border-red-400' : 'border-gray-500'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              {...register('age', {
                required: 'Age is required',
                min: { value: 13, message: 'Minimum age is 13' },
                max: { value: 120, message: 'Enter a valid age' },
                valueAsNumber: true
              })}
              type="number"
              placeholder="Your age"
              className={`w-full px-4 py-3 rounded-md bg-gray-700/60 text-white placeholder-gray-300 border ${errors.age ? 'border-red-400' : 'border-gray-500'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
            />
            {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age.message}</p>}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start space-x-2 text-sm text-gray-300">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 text-purple-500 border-gray-500 rounded focus:ring-purple-500"
          />
          <span>
            I agree to the{' '}
            <a href="#" className="text-purple-400 hover:text-purple-500 underline">Terms of Service</a> and{' '}
            <a href="#" className="text-purple-400 hover:text-purple-500 underline">Privacy Policy</a>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md font-medium transition duration-200 transform ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-400 hover:scale-[1.02] active:scale-[0.98]'
        } text-white`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default Signup;
