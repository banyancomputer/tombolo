import { auth } from '@/lib/firebase/client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import PublicLayout from '@/components/layouts/public/PublicLayout';
import PublicRoute from '@/components/utils/routes/Public';

const Login: NextPageWithLayout = ({}) => {
  const [values, setValues] = useState({ email: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState('');
  const [recover, setRecover] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(
    values.email.length === 0 || !emailValid || recover
  );
  const handleValueChange = (e: any) => {
    const id = e.target.id;
    const newValue = e.target.value;
    setValues({ ...values, [id]: newValue });

    // Check if email is valid
    if (id === 'email') {
      handleCheckEmail(e);
    }
  };

  const handleCheckEmail = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // TODO: Better email validation
    setEmailValid(value.length > 0);
  };

  const handleRecover = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(values.email)
      .then(() => {
        setRecover(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    setButtonDisabled(values.email.length === 0 || !emailValid || recover);
  }, [values, emailValid, recover]);

  return (
    <div>
      <PublicRoute>
        <div className="text-2xl font-medium align-left">Recover</div>

        <form
          onSubmit={handleRecover}
          className="w-full p-6 rounded bg-base-content text-base-100"
        >
          {/*<h2 className="mb-2 text-sm font-semibold">Email</h2>*/}
          <div className="relative">
            <input
              id="email"
              type="text"
              placeholder="me@here.com"
              className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-lg focus:outline-none w-full px-3 block ${
                emailValid ? '!border-green-300' : '!border-red-400'
              }`}
              onInput={handleValueChange}
            />
          </div>

          {error && (
            // Error when login fails
            <label htmlFor="registration" className="label">
              <span className="text-xxs !p-0 text-error text-left">
                There was an issue recovering your account. Please try again.
                Error: {error}
              </span>
            </label>
          )}

          <div className="flex items-center mt-4">
            <button
              className="ml-2 !h-[52px] flex-1 btn btn-primary disabled:opacity-50 disabled:border-neutral-900 disabled:text-neutral-900"
              disabled={buttonDisabled}
              type="submit"
            >
              {recover ? 'Email Sent' : 'Recover'}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        {recover && (
          <div className="text-sm text-center">
            <Link href="/login">
              <div className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                Back to Login
              </div>
            </Link>
          </div>
        )}
      </PublicRoute>
    </div>
  );
};

export default Login;

Login.getLayout = (page) => {
  return <PublicLayout>{page}</PublicLayout>;
};
