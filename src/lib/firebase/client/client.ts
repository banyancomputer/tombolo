// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseRealtimeDatabaseURL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const firebaseMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// This is the config exposed to the client
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  databaseURL: firebaseRealtimeDatabaseURL,
  measurementId: firebaseMeasurementId,
};

export interface Client {
  app: any;
  auth: any;
  db: any;
  storage: any;
  analytics: any;
}

const app = initializeApp(firebaseConfig, 'tombolo-client');
const app_db = getFirestore(app);
const app_storage = getStorage(app);
let _analytics;
if (typeof window !== 'undefined') {
  _analytics = getAnalytics(app);
}
const app_analytics = _analytics;
const app_auth = getAuth(app);

if (process.env.NODE_ENV === 'development') {
  console.log('Connecting Client to Emulator');
  connectAuthEmulator(app_auth, 'http://localhost:9099');
  connectFirestoreEmulator(app_db, 'localhost', 8080);
  connectStorageEmulator(app_storage, 'localhost', 9199);
}

const client: Client = {
  app,
  auth: app_auth,
  db: app_db,
  storage: app_storage,
  analytics: app_analytics,
};

export default client;
