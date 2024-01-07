import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  email?: string;
  password?: string;
  name?: string;
}

interface ErrorResponse {
  errorMessage: string;
}

export default function RegisterPage() {

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        if (res.headers.get('content-type')?.includes('text')) {
          const errorText = await res.text();
          throw new Error(errorText);
        } else {
          const errorData = await res.json() as ErrorResponse[];
          const combinedErrorMessage = errorData.map(receivedError => `${receivedError.errorMessage}`).join(`\n`);
          throw new Error(combinedErrorMessage || 'An unknown error occurred');
        }
      } else {
        setLoading(false);
        setErrors([]);
        navigate('/login');
      }
      
    } catch (err) {
      setLoading(false);
      if(err instanceof Error) {
        const errorMessages = err.message.split('\n');
        setErrors(errorMessages);
      } else {
        setErrors(['An unknown error occurred. Try again later']);
      }
    }
  };

  return (
    <div className='mx-auto mb-[7rem] mt-[5rem] max-w-lg rounded-lg bg-white p-6 shadow-lg'>
      <h1 className='mb-8 text-center text-4xl font-bold text-gray-800'>Sign Up</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */} 
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input
          type='text'
          placeholder='Name'
          className='border-gray-hover focus:border-green focus:ring-green rounded-lg border-2 p-3 focus:outline-none focus:ring-2'
          id='name'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          className='border-gray-hover focus:border-green focus:ring-green rounded-lg border-2 p-3 focus:outline-none focus:ring-2'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border-gray-hover focus:border-green focus:ring-green rounded-lg border-2 p-3 focus:outline-none focus:ring-2'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type='submit'
          className='bg-green border-gray-hover hover:bg-green-hover mt-8 rounded-lg py-3 font-bold text-white transition duration-200 ease-in-out disabled:bg-green-200'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='mt-6 text-center'>
        <p className='text-gray-600'>Have an account?</p>
        <Link to="/login">
          <span className='text-green hover:text-green-hover font-semibold'>Sign in</span>
        </Link>
      </div>
      {errors.length > 0 && (
        <div className='mt-6 text-center text-black'>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );

}
