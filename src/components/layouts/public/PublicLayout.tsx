import BackgroundImage from '@/images/background/BackgroundImage';
import Head from 'next/head';
import styles from './PublicLayout.module.css';

export interface IPublicLayout {}
// @ts-ignore
const PublicLayout: React.FC<IPublicLayout> = ({ children }) => {
  return (
    <>
      <div className="fixed h-screen w-full ">
        <div className="float-left flex justify-center items-center h-screen">
          <BackgroundImage />
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default PublicLayout;
