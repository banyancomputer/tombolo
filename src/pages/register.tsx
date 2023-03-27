import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/auth';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';
import PublicLayout from '@/components/layouts/public/PublicLayout';
import PublicRoute from '@/components/utils/routes/Public';
// import validator from 'validator';

const Register: NextPageWithLayout = ({}) => {
  const router = useRouter();
  const { user, userLoading } = useAuth();
  const [values, setValues] = useState({
    email: '',
    password: '',
    // confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    companyName: '',
    jobTitle: '',
  });
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);

  const [error, setError] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(
    values.email.length === 0 ||
      !emailValid ||
      values.password.length === 0 ||
      !passwordValid ||
      values.fullName.length === 0 ||
      values.companyName.length === 0 ||
      values.jobTitle.length === 0 ||
      values.phoneNumber.length === 0 ||
      !phoneNumberValid
  );
  const handleValueChange = (e: any) => {
    const id = e.target.id;
    const newValue = e.target.value;
    setValues({ ...values, [id]: newValue });
    console.log(values);

    // Check if email is valid
    if (id === 'email') {
      handleCheckEmail(e);
    }

    // Check if password is valid
    if (id === 'password') {
      handleCheckPassword(e);
    }

    // Check if phone number is valid
    if (id === 'phoneNumber') {
      handleCheckPhoneNumber(e);
    }
  };

  const handleCheckEmail = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // setEmailValid(validator.isEmail(value));
    setEmailValid(value.length > 0);
  };

  const handleCheckPassword = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // TODO: Better password validation
    // Check is password and confirm password are the same

    setPasswordValid(
      value.length > 6 // && values.password === values.confirmPassword
    );
  };

  const handleCheckPhoneNumber = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // setPhoneNumberValid(validator.isMobilePhone(value));
    setPhoneNumberValid(value.length > 0);
  };

  const handleSignUpUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Signing up user');
    // First, create the user with the client side firebase auth
    await auth
      .signUp(values.email, values.password)
      .then((uid) => {
        console.log('User created with firebase auth: ', uid);
        // Register the user with client side firebase auth
        db.registerUser(
          uid,
          values.email,
          values.fullName,
          values.companyName,
          values.jobTitle,
          values.phoneNumber
        )
          .then(() => {
            console.log('User registered with firebase db');
            router.push('/');
          })
          .catch((err) => {
            console.log('Could not register user with firebase db: ', err);
            setError(err.message);
            return null;
          });
      })
      .catch((err) => {
        console.log('Could not create user with firebase auth: ', err);
        setError(err.message);
        return null;
      });
  };

  useEffect(() => {
    setButtonDisabled(
      values.email.length === 0 ||
        !emailValid ||
        values.password.length === 0 ||
        !passwordValid ||
        values.fullName.length === 0 ||
        values.companyName.length === 0 ||
        values.jobTitle.length === 0 ||
        values.phoneNumber.length === 0 ||
        !phoneNumberValid
    );
  }, [values, emailValid, passwordValid, phoneNumberValid]);

  return (
    <div>
      <PublicRoute>
        <div className="text-6xl font-semibold align-left mb-2">Sign Up</div>
        <div className="text-xs font-normal align-left mb-8">
          Already have an account?{' '}
          <Link href="/login" className={`text-blue-500`}>
            Sign in.
          </Link>
        </div>
        <form onSubmit={handleSignUpUser}>
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
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>
          {/*<h2 className="mt-4 mb-2 text-sm font-semibold">Confirm Password</h2>*/}
          {/*<div className="relative">*/}
          {/*  <input*/}
          {/*    id="confirmPassword"*/}
          {/*    type="password"*/}
          {/*    placeholder="********"*/}
          {/*    className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-lg focus:outline-none w-full px-3 block ${*/}
          {/*      passwordValid ? '!border-blue-300' : '!border-orange-400'*/}
          {/*    }*/}
          {/*            `}*/}
          {/*    onInput={handleValueChange}*/}
          {/*  />*/}
          {/*</div>*/}
          <div className="relative">
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>
          <div className="relative">
            <input
              id="companyName"
              type="text"
              placeholder="Company Name"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>
          <div className="relative">
            <input
              id="jobTitle"
              type="text"
              placeholder="Job Title"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>
          <div className="relative">
            <input
              id="phoneNumber"
              type="text"
              placeholder="Phone Number"
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
              onInput={handleValueChange}
            />
          </div>

          {error && (
            // Error when login fails
            <label htmlFor="registration" className="label">
              <span className="text-xxs !p-0 text-error text-left">
                There was an issue with your registration: {error}
              </span>
            </label>
          )}

          <div className="flex items-center mt-4">
            <button
              className="!h-[52px] flex-1 text-[#00143173] rounded-sm bg-[#CED6DE] text-"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </PublicRoute>
    </div>
  );
};

export default Register;

Register.getLayout = (page) => {
  return <PublicLayout>{page}</PublicLayout>;
};
