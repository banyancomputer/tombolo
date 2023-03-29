const firebaseAdmin = require('../client');

/*
 * Manifest Management
 * Used for interacting with the manifest files in the Firebase Storage bucket
 */

/*
 * putManifestFile
 * Puts a manifest file in the Firebase Storage bucket
 * @param {string} userId - The user id of the user who owns the upload
 * @param {string} uploadId - The id of the upload
 * @param {string} manifest_path - The path to the manifest file on the local filesystem
 * @returns {void}
 * @throws {Error} - If the manifest could not be put
 * PLaces the manifest file in the Firebase Storage bucket at:
 * /manifests/{userId}/{uploadId}/manifest.json
 */
async function putManifestFile(userId, uploadId, manifest_path) {
  // Get the default bucket
  const bucket = firebaseAdmin.storage().bucket();
  const file = bucket.file(`manifests/${userId}/${uploadId}/manifest.json`);
  const manifest = require(manifest_path);
  await file.save(JSON.stringify(manifest));
}

/*
 * deleteManifestFile
 * Deletes a manifest file from the Firebase Storage bucket
 * @param {string} userId - The user id of the user who owns the upload
 * @param {string} uploadId - The id of the upload
 * @returns {void}
 * @throws {Error} - If the manifest could not be deleted
 * Deletes the manifest file from the Firebase Storage bucket at:
 * /manifests/{userId}/{uploadId}/manifest.json
 */
async function deleteManifestFile(userId, uploadId) {
  // Get the default bucket
  const bucket = firebaseAdmin.storage().bucket();
  const file = bucket.file(`manifests/${userId}/${uploadId}/manifest.json`);
  await file.delete();
}

module.exports = { putManifestFile, deleteManifestFile };
