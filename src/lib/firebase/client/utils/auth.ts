import client from '@/lib/firebase/client/client';
import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
} from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser | null;
export const onAuthStateChanged = (callback: any) => {
  return firebaseOnAuthStateChanged(client.auth, (user: User) => {
    callback(user);
  });
};

export const signUp = async (
  email: string,
  password: string
): Promise<string> => {
  return firebaseCreateUserWithEmailAndPassword(
    client.auth,
    email,
    password
  ).then((userCredential) => {
    return userCredential.user.uid;
  });
};

// Non-federated sign in -- email and password
export const signIn = async (
  email: string,
  password: string
): Promise<string> => {
  return firebaseSignInWithEmailAndPassword(client.auth, email, password).then(
    (userCredential) => {
      return userCredential.user.uid;
    }
  );
};

// Sign out
export const signOut = async () => {
  return firebaseSignOut(client.auth);
};

// Password reset request
export const sendPasswordResetEmail = async (email: string) => {
  return firebaseSendPasswordResetEmail(client.auth, email);
};

// Change password (while signed in)
export const updatePassword = async (newPassword: string) => {
  return firebaseUpdatePassword(client.auth.currentUser, newPassword);
};

// Change email (while signed in)
export const updateEmail = async (newEmail: string) => {
  return firebaseUpdateEmail(client.auth.currentUser, newEmail);
};
