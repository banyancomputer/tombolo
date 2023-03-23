import client from '@/lib/firebase/client';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updatePassword,
  updateEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser | null;

export const getCurrentUser = (): User => {
  return client.auth.currentUser;
};

export const getToken = async (): Promise<string> => {
  const user = client.auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  } else {
    return '';
  }
};

export const onIdTokenChanged = (callback: any) => {
  return client.auth.onIdTokenChanged((user: User) => callback(user));
};

export const signUp = async (
  email: string,
  password: string
): Promise<string> => {
  return createUserWithEmailAndPassword(client.auth, email, password).then(
    (userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user.uid;
    }
  );
};

// Non-federated sign in -- email and password
export const signInDefault = async (email: string, password: string) => {
  return signInWithEmailAndPassword(client.auth, email, password);
};

// Sign out
export const signOutDefault = async () => {
  return signOut(client.auth);
};

// Password reset request
export const sendPasswordResetEmail = async (email: string) => {
  console.log('sendPasswordResetEmail', email);
  return fbSendPasswordResetEmail(client.auth, email);
};

// Change password (while signed in)
export const changePassword = async (newPassword: string) => {
  // return client.auth.currentUser.updatePassword(newPassword);
  return updatePassword(client.auth.currentUser, newPassword);
};

// Change email (while signed in)
export const changeEmail = async (newEmail: string) => {
  return updateEmail(client.auth.currentUser, newEmail);
};
