import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '@/lib/firebase/client';
import nookies from 'nookies';

export const AuthContext = createContext<{
  user: auth.User;
  userLoading: boolean;
}>({
  user: null,
  userLoading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<auth.User | null>(null);

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    setUserLoading(true);
    return auth.onIdTokenChanged(async (user: auth.User) => {
      if (!user) {
        setUser(null);
        setUserLoading(false);
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        setUserLoading(false);
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.getCurrentUser();
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
