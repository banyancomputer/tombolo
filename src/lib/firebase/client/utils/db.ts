import { Upload, uploadConverter } from '@/lib/entities/upload';
import { File, fileConverter } from '@/lib/entities/file';
import client from '@/lib/firebase/client/client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { userConverter } from '@/lib/entities/user';

export async function registerUser(
  uid: string,
  email: string,
  fullName: string,
  companyName: string,
  jobTitle: string,
  phoneNumber: string
) {
  // Create /users/{uid} document in Firestore
  const userRef = collection(client.db, 'users');
  await setDoc(doc(userRef, uid), {
    email: email,
    fullName: fullName,
    companyName: companyName,
    jobTitle: jobTitle,
    phoneNumber: phoneNumber,
  });
}

export async function updateUserEmail(uid: string, email: string) {
  const userDoc = doc(client.db, 'users', uid);
  await updateDoc(userDoc, {
    email: email,
  });
}

export async function getUser(uid: string) {
  const userDoc = doc(client.db, 'users', uid);
  const snapshot = await getDoc(userDoc).catch((error) => {
    console.log('Error getting user: ', error);
    return error;
  });
  const user = userConverter.fromFirestore(snapshot, {});
  return user;
}

export async function createUpload(uid: string, upload: Upload) {
  const uploadRef = collection(client.db, 'users/' + uid + '/uploads');
  await setDoc(doc(uploadRef, upload.id), uploadConverter.toFirestore(upload));
}

export async function getUpload(uid: string, uploadId: string) {
  const uploadDoc = doc(client.db, 'users/' + uid + '/uploads', uploadId);
  const snapshot = await getDoc(uploadDoc).catch((error) => {
    console.log('Error getting upload: ', error);
    return error;
  });
  return uploadConverter.fromFirestore(snapshot, {});
}

export async function getUploads(uid: string) {
  const uploadsRef = collection(client.db, 'users/' + uid + '/uploads');
  const snapshot = await getDocs(uploadsRef).catch((error) => {
    console.log('Error getting uploads: ', error);
    return error;
  });
  const uploads: Upload[] = [];
  snapshot.forEach((doc: any) => {
    const upload = uploadConverter.fromFirestore(doc, {});
    uploads.push(upload);
  });
  return uploads;
}

export async function totalUploadsSize(uid: string) {
  const uploadsRef = collection(client.db, 'users/' + uid + '/uploads');
  const snapshot = await getDocs(uploadsRef).catch((error) => {
    console.log('Error getting uploads: ', error);
    return error;
  });
  let totalSize = 0;
  snapshot.forEach((doc: any) => {
    const upload = uploadConverter.fromFirestore(doc, {});
    totalSize += upload.size;
  });
  return totalSize;
}

export async function createFile(path: string, name: string, size: number) {
  const fileRef = collection(client.db, 'files');
  await setDoc(doc(fileRef, path), {
    name: name,
    size: size,
  });
}

export async function getFile(path: string) {
  const fileRef = collection(client.db, 'files');
  const snapshot = await getDocs(fileRef).catch((error) => {
    console.log('Error getting file: ', error);
    return error;
  });
  const file = fileConverter.fromFirestore(snapshot, {});
  return file;
}

export async function getFiles(uid: string, uploadId: string) {
  const filesRef = collection(
    client.db,
    'users/' + uid + '/uploads/' + uploadId + '/files'
  );
  const snapshot = await getDocs(filesRef).catch((error) => {
    console.log('Error getting files: ', error);
    return error;
  });
  const files: File[] = [];
  snapshot.forEach((doc: any) => {
    const file = fileConverter.fromFirestore(doc, {});
    files.push(file);
  });
  return files;
}
