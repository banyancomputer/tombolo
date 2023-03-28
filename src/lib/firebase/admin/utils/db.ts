import { ref, get } from 'firebase/database';
import Upload from '@/lib/entities/upload';
import RTFile from '@/lib/entities/file';
import admin from '@/lib/firebase/admin';

export async function checkUserExists(uid: string): Promise<boolean> {
  const userRef = admin.database().ref('users/' + uid);
  let exists = false;
  try {
    const snapshot = await userRef.get();
    if (snapshot.exists()) {
      exists = true;
    }
  } catch (error) {
    console.log(error);
  }
  return exists;
}

export async function getUser(uid: string) {
  const userRef = admin.database().ref('users/' + uid);
  let user: any = null;
  try {
    const snapshot = await userRef.get();
    if (snapshot.exists()) {
      user = snapshot.val();
    }
  } catch (error) {
    console.log(error);
  }
  return user;
}

export async function createUser(
  uid: string,
  email: string,
  fullName: string,
  companyName: string,
  jobTitle: string,
  phoneNumber: string
) {
  const userRef = admin.database().ref('users/' + uid);
  try {
    await userRef.set({
      email: email,
      fullName: fullName,
      companyName: companyName,
      jobTitle: jobTitle,
      phoneNumber: phoneNumber,
      uploads: {},
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getFilesByUpload(uid: any, uploadId: any): Promise<RTFile[]> {
  console.log('getFilesByUpload: ', uploadId);
    // Get all user uploads
  const uploads = await getUploadsByUser(uid);
  
  // Iterate over all user uploads
  for (const upload of uploads) {
    // If the upload matches the requestd ID
    if (upload.id === uploadId) {
      // Return the files
      return upload.files;
    }
  }
  return [];
}

export interface DbError {
  code: string;
  message: string;
}

// TODO: Proper error handling
export const getUploadsByUser = async (uid: string): Promise<Upload[]> => {
  console.log('getUploadsByUser: ', uid);
  const uploadsRef = admin.database().ref('users/' + uid + '/uploads');
  let uploads: Upload[] = [];
  try {
    // const snapshot = await get(uploadsRef);
    const snapshot = await uploadsRef.get();
    if (snapshot.exists()) {
      uploads = snapshot.val();
    }
  } catch (error) {
    console.log(error);
  }
  return uploads;
};
