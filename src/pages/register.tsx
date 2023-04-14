import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/auth';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import PublicLayout from '@/components/layouts/public/PublicLayout';
import validator from 'validator';
import { passwordStrength } from 'check-password-strength';
import { AsYouType } from 'libphonenumber-js';

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
  const [nameValid, setNameValid] = useState(true);
  const [companyNameValid, setCompanyNameValid] = useState(true);
  const [jobTitleValid, setJobTitleValid] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState<
    string | null
  >(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValue, setconfirmPasswordValue] = useState<
    string | null
  >(null);

  const [error, setError] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(
    values.email.length === 0 ||
      !emailValid ||
      values.password.length === 0 ||
      !passwordValid ||
      values.fullName.length === 0 ||
      !nameValid ||
      values.companyName.length === 0 ||
      !companyNameValid ||
      values.jobTitle.length === 0 ||
      !jobTitleValid ||
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

    // Check if full name is valid
    if (id === 'fullName') {
      handleCheckName(e);
    }

    // Check if company name is valid
    if (id === 'companyName') {
      handleCheckCompany(e);
    }

    // Check if job title  is valid
    if (id === 'jobTitle') {
      handleCheckJobTitle(e);
    }

    // Check if phone number is valid
    if (id === 'phoneNumber') {
      handleCheckPhoneNumber(e);
    }
  };

  const handleCheckEmail = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setEmailValid(validator.isEmail(value));
  };

  const handleCheckPassword = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    const strength = passwordStrength(value);
    const passwordsMatch = value === confirmPassword;

    // Check if password is strong
    {
      if (value.length > 0) {
        setPasswordStrengthValue(strength.value);
      } else {
        setPasswordStrengthValue(null);
      }
    }
    // Check if password and confirm password are the same
    if (value.length === 0 || values.password.length === 0) {
      setconfirmPasswordValue(null);
    } else if (passwordsMatch) {
      setconfirmPasswordValue('Passwords match!');
    } else {
      setconfirmPasswordValue('Passwords do not match!');
    }
    // Check is password and confirm password are the same
    setPasswordValid(passwordsMatch);
  };

  const handleConfirmPasswordChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setConfirmPassword(value);
    const passwordsMatch = value === values.password;

    if (value.length === 0 || values.password.length === 0) {
      setconfirmPasswordValue(null);
    } else if (passwordsMatch) {
      setconfirmPasswordValue('Passwords match!');
    } else {
      setconfirmPasswordValue('Passwords do not match!');
    }

    // Check if password and confirm password are the same
    setPasswordValid(passwordsMatch);
  };

  const handleCheckName = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    const regex = /^[A-Za-z]+(?:[.'\- ][A-Za-z]+)*$/;
    setNameValid(regex.test(value));
  };

  const handleCheckCompany = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    const regex = /^[A-Za-z0-9]+(?:, [A-Za-z0-9]+)*(?: [A-Za-z0-9]+)*$/;
    setCompanyNameValid(regex.test(value));
  };

  const handleCheckJobTitle = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    const regex = /^[A-Za-z]+(?:[ ][A-Za-z]+)*$/;
    setJobTitleValid(regex.test(value));
  };

  const handleCheckPhoneNumber = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setPhoneNumberValid(validator.isMobilePhone(value));

    // libphonenumber-js does not allow for backspace after entering full US number
    // also note there are no REGEX rules for this library
    if (value.length < phoneNumber.length) {
      setPhoneNumber(value);
    } else {
      // note this is set for US numbers only
      const formatPhoneNumber = new AsYouType('US').input(value);
      setPhoneNumber(formatPhoneNumber);
    }
  };

  const handleSignUpUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = await auth.signUp(values.email, values.password);
      // Register the user with client side firebase auth
      await db.registerUser(
        userId,
        values.email,
        values.fullName,
        values.companyName,
        values.jobTitle,
        values.phoneNumber
      );
      // Page will redirect to login page at this point
      await router.push('/login');
    } catch (err: any) {
      console.log('Could not create user with firebase auth: ', err);
      setError(err.message);
      return;
    }
  };

  useEffect(() => {
    setButtonDisabled(
      values.email.length === 0 ||
        !emailValid ||
        values.password.length === 0 ||
        !passwordValid ||
        values.fullName.length === 0 ||
        !nameValid ||
        values.companyName.length === 0 ||
        !companyNameValid ||
        values.jobTitle.length === 0 ||
        !jobTitleValid ||
        values.phoneNumber.length === 0 ||
        !phoneNumberValid
    );
  }, [values, emailValid, passwordValid, phoneNumberValid]);

  return (
    <div>
      {/*<PublicRoute>*/}
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
            className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
            onInput={handleValueChange}
          />

          <div className="text-xs mb-2">
            {passwordStrengthValue}
            <div>
              {passwordStrengthValue === 'Weak' ||
              passwordStrengthValue === 'Too weak' ? (
                <div className="px-4">
                  We recommend
                  <li>At least 8 characters</li>
                  <li>One upper case letter</li>
                  <li>One lower case letter</li>
                  <li>One special character </li>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="relative">
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
            onInput={handleConfirmPasswordChange}
          />
          <div className="text-xs mb-3">{confirmPasswordValue}</div>
        </div>
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
            value={phoneNumber}
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
            className={`!h-[52px] flex-1 rounded-sm  ${
              buttonDisabled
                ? 'text-[#00143173]  bg-[#CED6DE]'
                : 'text-[#FFF] bg-[#000]'
            }`}
            type="submit"
            disabled={buttonDisabled}
          >
            Sign Up
          </button>
        </div>
      </form>
      {/*</PublicRoute>*/}
    </div>
  );
};

export default Register;

Register.getLayout = (page) => {
  return <PublicLayout>{page}</PublicLayout>;
};
