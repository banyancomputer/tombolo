import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth';
import React from 'react';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';
import LoadingScreen from '@/components/utils/screens/LoadingScreen';

// Use this component to wrap any page that should only be accessible to logged in users
export interface IAuthorizedRoute {}
// @ts-ignore
const AuthorizedRoute: React.FC<IAuthorizedRoute> = ({ children }) => {
  const { user, userLoading } = useAuth();
  const Router = useRouter();

  if (user) {
    return <>{children}</>;
  } else if (userLoading) {
    return <LoadingScreen />;
  } else {
    Router.push('/login');
    return null;
  }
};

export default AuthorizedRoute;
