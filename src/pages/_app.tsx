import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NextPageWithLayout } from '@/pages/page';
import { AuthProvider } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader) loader.remove();
    }
  }, []);

  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <AuthProvider>
      <Component {...pageProps} />
      {/*{loading ? <LoadingSpinner /> : <Component {...pageProps} />}*/}
    </AuthProvider>
  );
}
