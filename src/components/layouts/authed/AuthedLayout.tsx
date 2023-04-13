import styles from './AuthedLayout.module.css';
import SideNav from '@/components/navs/side/SideNav';
import SideNavMobile from '@/components/navs/side/SideNavMobile';
import useIsMobile from '@/components/utils/device/useIsMobile';

export interface IAuthedLayout {}
// @ts-ignore
const AuthedLayout: React.FC<IAuthedLayout> = ({ children }) => {
  const [isMobile] = useIsMobile();

  return (
    <main className={styles.main}>
      {isMobile ? (
        <SideNavMobile>{children}</SideNavMobile>
      ) : (
        <SideNav>{children}</SideNav>
      )}
    </main>
  );
};

export default AuthedLayout;
