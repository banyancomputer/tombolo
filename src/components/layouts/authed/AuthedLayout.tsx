import Head from 'next/head';
import styles from './AuthedLayout.module.css';
import SideNav from '@/components/navs/side/SideNav';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';

export interface IAuthedLayout {}
// @ts-ignore
const AuthedLayout: React.FC<IAuthedLayout> = ({ children }) => {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  // Redirect to login if user is not authenticated
  if (!user && !userLoading) {
    router.push('/login');
  }
  return (
    <>
      <main className={styles.main}>
        <SideNav>{children}</SideNav>
      </main>
    </>
  );
};

export default AuthedLayout;
