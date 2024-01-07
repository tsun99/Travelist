import { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { getCurrentUser, login } from '../api/userService.ts';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/slices/userSlice.ts';
import { RootState } from '../redux/stores/store.ts';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const token = await login(formData);
      localStorage.setItem('token', token);

      const user = await getCurrentUser(token);
      dispatch(signInSuccess(user));

      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        dispatch(signInFailure(err.message));
      } else {
        dispatch(signInFailure('An unknown error occurred. Try again later'));
      }
    }
  };

  return (
    <div className="mx-auto mb-[7rem] mt-[5rem] max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
        Login
      </h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="email"
          placeholder="Email"
          className="border-gray-hover focus:border-green focus:ring-green rounded-lg border-2 p-3 focus:outline-none focus:ring-2"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border-gray-hover focus:border-green focus:ring-green rounded-lg border-2 p-3 focus:outline-none focus:ring-2"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-green border-gray-hover hover:bg-green-hover mt-8 rounded-lg py-3 font-bold text-white transition duration-200 ease-in-out disabled:bg-green-200"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-600">{`Don't have an account?`}</p>
        <Link to="/register">
          <span className="text-green hover:text-green-hover font-semibold">
            Sign up
          </span>
        </Link>
      </div>
      {error && <p className="mt-6 text-center text-red-600">{error}</p>}
    </div>
  );
}
