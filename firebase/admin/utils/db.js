const File = require('../entities/file');
const Upload = require('../entities/upload');
const User = require('../entities/user');
const firebaseAdmin = require('../client');

// Admin DB utils

// Upload Management

// Initialize a new upload for a user and with a given name
// Returns the upload object
async function initializeUpload(uid, name) {
  const upload = new Upload.Upload(name);
  await createUpload(uid, upload);
  return upload;
}

// Update the status of an upload
// 0 -> Upload Requested
// 1 -> Dataprep Started
// 2 -> Dataprep Complete, Scheduled for Upload
// 3 -> Uploaded and stored on Filecoin
// 4 -> Terminated
async function updateUploadStatus(uid, uploadId, status) {
  if (status < 0 || status > 4) {
    throw new Error('Invalid status');
  }
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef.doc(uploadId).update({ status: status });
}

// Update the details of an upload
// Main details we want to update are:
// - size
// - root
// - manifest
async function updateUploadDetails(uid, uploadId, details) {
  // Validate details
  if (!details.size || !details.root || !details.manifest) {
    throw new Error('Invalid details');
  }
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef.doc(uploadId).update(details);
}

// User Management

// Get a user by their email
async function getUserByEmail(email) {
  const database = firebaseAdmin.firestore();
  const usersRef = database.collection('users');
  const userQuery = usersRef.where('email', '==', email).limit(1);
  return await userQuery.get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return new User.User(userDoc.id, userDoc.data());
  });
}

// Check if an upload exists for a user. If it exists return the status
async function uploadExists(uid, uploadId) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  const uploadDoc = await uploadRef.doc(uploadId).get();
  if (!uploadDoc.exists) {
    return null;
  }
  return uploadDoc.data().status;
}

async function deleteUpload(uid, uploadId) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef.doc(uploadId).delete();
  // Delete all files associated with the upload
  const filesRef = database.collection(
    'users/' + uid + '/uploads/' + uploadId + '/files'
  );
  const filesQuery = filesRef.limit(100);
  const filesQuerySnapshot = await filesQuery.get();
  if (filesQuerySnapshot.empty) {
    return;
  }
  const batch = database.batch();
  filesQuerySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
}

// Add a file to an upload
async function addFileToUpload(uid, uploadId, file) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef
    .doc(uploadId)
    .collection('files')
    .doc(file.id)
    .set(File.fileConverter.toFirestore(file));
}

module.exports = {
  getUserByEmail,
  initializeUpload,
  updateUploadDetails,
  updateUploadStatus,
  addFileToUpload,
  uploadExists,
  deleteUpload,
};

async function createUpload(uid, upload) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  console.log(Upload.uploadConverter.toFirestore(upload));
  await uploadRef
    .doc(upload.id)
    .set(Upload.uploadConverter.toFirestore(upload));
}
