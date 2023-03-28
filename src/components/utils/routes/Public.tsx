import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth';
import React from 'react';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';

// Use this component to wrap any page that should only be accessible to logged out users
export interface IPublicRoute {}
// @ts-ignore
const PublicRoute: React.FC<IPublicRoute> = ({ children }) => {
  const { user, userLoading } = useAuth();

  if (!user) {
    return <>{children}</>;
  } else {
    window.location.href = window.location.origin;
    return null;
  }
};

export default PublicRoute;
