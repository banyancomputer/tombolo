import BackgroundImage from '@/images/background/BackgroundImage';
import styles from './PublicLayout.module.css';

export interface IPublicLayout {}
// @ts-ignore
const PublicLayout: React.FC<IPublicLayout> = ({ children }) => {
  return (
    <>
      <div className="fixed h-screen w-full flex">
        <div className="h-full object-cover float-left">
          <BackgroundImage />
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default PublicLayout;
