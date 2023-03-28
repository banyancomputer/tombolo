import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NextPageWithLayout } from '@/pages/page';
import { AuthProvider } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';
import { ChakraProvider } from '@chakra-ui/react';

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
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
      {/*{loading ? <LoadingSpinner /> : <Component {...pageProps} />}*/}
    </AuthProvider>
  );
}
