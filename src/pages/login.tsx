import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';
import PublicLayout from '@/components/layouts/public/PublicLayout';
import PublicRoute from '@/components/utils/routes/Public';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/auth';

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
        <div className="text-6xl font-semibold align-left mb-2">Log in</div>
        <div className="text-xs font-normal align-left mb-6">
          New User?{' '}
          <Link href="/register" className="text-blue-500">
            Sign up for free.
          </Link>
        </div>
        <form onSubmit={handleLoginUser}>
          <div className="relative">
            <input
              id="email"
              type="text"
              placeholder="E-mail"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
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
            <button
              className="!h-[52px] flex-1 text-[#FFF] bg-[#000] rounded-sm"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Password Reset Email */}
        <div className="text-sm text-center">
          <Link href="/recover">
            <div className="text-blue-500 text-xs mt-4">
              Get help logging in.
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
