import styles from './AuthedLayout.module.css';
import SideNav from '@/components/navs/side/SideNav';
import { useMediaQuery } from '@chakra-ui/media-query';
import SideNavMobile from '@/components/navs/side/SideNavMobile';

export interface IAuthedLayout {}
// @ts-ignore
const AuthedLayout: React.FC<IAuthedLayout> = ({ children }) => {
  // const [isMobile] = useMediaQuery('(max-width: 79px)');

  return (
    <main className={styles.main}>
      {/* {isMobile ? (
        <SideNavMobile>{children}</SideNavMobile>
      ) : (
        <SideNav>{children}</SideNav>
      )} */}
      <SideNav>{children}</SideNav>
    </main>
  );
};

export default AuthedLayout;
