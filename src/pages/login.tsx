import { useAuth } from '@/contexts/auth';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';
import PublicLayout from '@/components/layouts/public/PublicLayout';
import PublicRoute from '@/components/utils/routes/Public';
import { auth } from '@/lib/firebase/client';

const Login: NextPageWithLayout = ({}) => {
  const { logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [error, setError] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(
    values.email.length === 0 ||
      !emailValid ||
      values.password.length === 0 ||
      !passwordValid
  );
  const handleValueChange = (e: any) => {
    const id = e.target.id;
    const newValue = e.target.value;
    setValues({ ...values, [id]: newValue });

    // Check if email is valid
    if (id === 'email') {
      handleCheckEmail(e);
    }

    // Check if password is valid
    if (id === 'password') {
      handleCheckPassword(e);
    }
  };

  const handleCheckEmail = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // TODO: Better email validation
    setEmailValid(value.length > 0);
  };

  const handleCheckPassword = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // TODO: Better password validation
    setPasswordValid(value.length > 0);
  };

  const handleLoginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    auth.signIn(values.email, values.password).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    setButtonDisabled(
      values.email.length === 0 ||
        !emailValid ||
        values.password.length === 0 ||
        !passwordValid
    );
  }, [values, emailValid, passwordValid]);

  return (
    <div>
      <PublicRoute>
        <div className="text-2xl font-medium align-left">Login</div>
        <div className="text-sm text-gray-500 align-left">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500">
            Sign up
          </Link>
        </div>
        <form
          onSubmit={handleLoginUser}
          className="w-full p-6 rounded bg-base-content text-base-100"
        >
          <h2 className="mb-2 text-sm font-semibold">Email</h2>
          <div className="relative">
            <input
              id="email"
              type="text"
              placeholder="me@here.com"
              className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-lg focus:outline-none w-full px-3 block ${
                emailValid ? '!border-blue-300' : '!border-orange-400'
              }`}
              onInput={handleValueChange}
            />
          </div>
          <h2 className="mt-4 mb-2 text-sm font-semibold">Password</h2>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="********"
              className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-lg focus:outline-none w-full px-3 block ${
                passwordValid ? '!border-blue-300' : '!border-orange-400'
              }
                    `}
              onInput={handleValueChange}
            />
          </div>

          {error && (
            // Error when login fails
            <label htmlFor="registration" className="label">
              <span className="text-xxs !p-0 text-error text-left">
                There was an issue logging you in. Please try again.
              </span>
            </label>
          )}

          <div className="flex items-center mt-4">
            {loading ? (
              <div className="flex-1 ml-2">
                <LoadingSpinner />
              </div>
            ) : (
              <button
                className="ml-2 !h-[52px] flex-1 btn btn-primary disabled:opacity-50 disabled:border-neutral-900 disabled:text-neutral-900"
                disabled={buttonDisabled}
                type="submit"
              >
                Login
              </button>
            )}
          </div>
        </form>

        {/* Password Reset Email */}
        <div className="text-sm text-center">
          <Link href="/recover">
            <div className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              Forgot your password?
            </div>
          </Link>
        </div>
      </PublicRoute>
    </div>
  );
};

export default Login;

Login.getLayout = (page) => {
  return <PublicLayout>{page}</PublicLayout>;
};
