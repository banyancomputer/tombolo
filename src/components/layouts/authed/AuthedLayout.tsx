import styles from './AuthedLayout.module.css';
import SideNav from '@/components/navs/side/SideNav';

export interface IAuthedLayout {}
// @ts-ignore
const AuthedLayout: React.FC<IAuthedLayout> = ({ children }) => {
  return (
    <main className={styles.main}>
      <SideNav>{children}</SideNav>
    </main>
  );
};

export default AuthedLayout;
