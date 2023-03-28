import client from '@/lib/firebase/client/client';
import { getDownloadURL, ref } from '@firebase/storage';

// Get manifest.json at the specified bucket path
export const getManifestUrl = async (
  uid: string,
  uploadid: string
): Promise<string> => {
  let bucketPath = 'manifests/' + uid + '/' + uploadid;
  console.log('bucketPath: ', bucketPath);
  const manifestRef = ref(client.storage, bucketPath + '/manifest.json');
  return getDownloadURL(manifestRef);
};
