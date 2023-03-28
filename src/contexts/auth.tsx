import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '@/lib/firebase/client';

export const AuthContext = createContext<{
  user: auth.User;
  userLoading: boolean;
  signUp: (email: string, password: string) => Promise<string>;
  logIn: (email: string, password: string) => Promise<string>;
  logOut: () => Promise<void>;
}>({
  user: null,
  userLoading: true,
  signUp: async (email: string, password: string) => '',
  logIn: async (email: string, password: string) => '',
  logOut: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<auth.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user: auth.User) => {
      setUser(user);
      setUserLoading(false);
    });
  });

  const signUp = (email: string, password: string): Promise<string> => {
    return auth
      .signUp(email, password)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        return err.message;
      });
  };

  const logIn = (email: string, password: string): Promise<string> => {
    return auth
      .signIn(email, password)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        return err.message;
      });
  };

  const logOut = (): Promise<void> => {
    return auth.signOut().catch((err) => {
      return err.message;
    });
  };

  return (
    <AuthContext.Provider value={{ user, userLoading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
