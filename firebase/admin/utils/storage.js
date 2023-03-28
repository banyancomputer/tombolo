const firebaseAdmin = require('../client');

async function putManifestFile(userId, uploadId, manifest_path) {
  // Get the default bucket
  const bucket = firebaseAdmin.storage().bucket();
  const file = bucket.file(`manifests/${userId}/${uploadId}/manifest.json`);
  const manifest = require(manifest_path);
  await file.save(JSON.stringify(manifest));
}

async function deleteManifestFile(userId, uploadId) {
  // Get the default bucket
  const bucket = firebaseAdmin.storage().bucket();
  const file = bucket.file(`manifests/${userId}/${uploadId}/manifest.json`);
  await file.delete();
}

module.exports = { putManifestFile, deleteManifestFile };
