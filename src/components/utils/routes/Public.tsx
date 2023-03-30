import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth';
import React, { useEffect } from 'react';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';

// Use this component to wrap any page that should only be accessible to logged out users
export interface IPublicRoute {}
// @ts-ignore
const PublicRoute: React.FC<IPublicRoute> = ({ children }) => {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !userLoading) {
      router.push('/').then(() => window.scrollTo(0, 0));
    }
  }, [user]);

  return <>{children}</>;
};

export default PublicRoute;
