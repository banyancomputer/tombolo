const File = require('../entities/file');
const Upload = require('../entities/upload');
const User = require('../entities/user');
const firebaseAdmin = require('../client');

// Admin DB utils
// Used for interacting with the Firestore database using the admin SDK and a Service Account

/*
 * Upload Management
 */

/*
 * initializeUpload
 * Creates a new upload in Firestore and returns an Upload object
 * @param {string} uid - The user id of the user who owns the upload
 * @param {string} name - The name of the upload
 * @returns {Upload} - The upload object
 * @throws {Error} - If the upload could not be created
 */
async function initializeUpload(uid, name) {
  const upload = new Upload.Upload(name);
  return createUpload(uid, upload)
    .then(() => {
      return upload;
    })
    .catch((err) => {
      throw err;
    });
}

/*
 * Update the status of an upload
 * Statuses:
 * 0 - Initialized
 * 1 - Data Prepared
 * 2 - Stored
 * 3 - Deleted
 * @param {string} uid - The user id of the user who owns the upload
 * @param {string} uploadId - The id of the upload
 * @param {number} status - The status to update to
 * @returns {void}
 * @throws {Error} - If the status is invalid
 */
async function updateUploadStatus(uid, uploadId, status) {
  if (status < 0 || status > 3) {
    throw new Error('Invalid status');
  }
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef.doc(uploadId).update({ status: status });
}

/*
 * Update the details of an upload related to the data it specifies
 * @param {string} uid - The user id of the user who owns the upload
 * @param {string} uploadId - The id of the upload
 * @param {object} details - The details to update. Of the form:
 * {
 *  size: number,
 *  root: string,
 *  manifest: string
 * }
 * @returns {void}
 */
async function updateUploadDetails(uid, uploadId, details) {
  // Validate details
  if (!details.size || !details.root || !details.manifest) {
    throw new Error('Invalid details');
  }
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  await uploadRef.doc(uploadId).update(details);
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

/*
 * User Management
 */

/*
 * getUserByEmail
 * Gets a user by their email
 * @param {string} email - The email of the user
 * @returns {User} - The user object
 */
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

/*
 * File Management
 */

/*
 * addFileToUpload
 * Adds a file to an upload
 * @param {string} uid - The user id of the user who owns the upload
 * @param {string} uploadId - The id of the upload
 * @param {File} file - The file to add
 */
async function addFile(uid, uploadId, file) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  uploadRef
    .doc(uploadId)
    .collection('files')
    .doc(file.id)
    .set(File.fileConverter.toFirestore(file))
    .catch((err) => {
      throw err;
    });
}

module.exports = {
  getUserByEmail,
  initializeUpload,
  updateUploadDetails,
  updateUploadStatus,
  addFile,
  uploadExists,
  deleteUpload,
};

/* Helper functions */

// Create an upload Document in Firestore
async function createUpload(uid, upload) {
  const database = firebaseAdmin.firestore();
  const uploadRef = database.collection('users/' + uid + '/uploads');
  console.log(Upload.uploadConverter.toFirestore(upload));
  await uploadRef
    .doc(upload.id)
    .set(Upload.uploadConverter.toFirestore(upload))
    .catch((err) => {
      throw err;
    });
}
