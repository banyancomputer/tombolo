// This is very messy. It is meant to be deprecated quickly.
// You can shame me but I won't fix it.

const File = require('./entities/file');
const {
  initializeUpload,
  getUserByEmail,
  updateUploadStatus,
  addFileToUpload,
  updateUploadDetails,
  uploadExists,
  deleteUpload,
} = require('./utils/db');
const { putManifestFile, deleteManifestFile } = require('./utils/storage');

// Read command line arguments
const args = process.argv.slice(2);

let email, name, uploadId, status, manifest_path;

// Switch based on command
switch (args[0]) {
  case 'initialize-upload':
    console.log('Initializing upload');
    // Get the email and name from the command line
    email = args[1];
    name = args[2];
    console.log('-> User Email', email);
    console.log('-> Upload Name', name);
    // Get the user by email and initialize the upload
    getUserByEmail(email)
      .then((user) => {
        console.log('-> User ID', user.id);
        _user = user;
        // Initialize the upload
        const upload = initializeUpload(user.id, name)
          .then((upload) => {
            console.log('Created Upload with ID', upload.id);
            console.log(
              'Upload initialized at /users/' +
                user.id +
                '/uploads/' +
                upload.id
            );
          })
          .catch((err) => {
            console.log('Error initializing upload', err);
          });
      })
      .catch((err) => {
        console.log('Error getting user by email: ', err);
        console.log('User not found. Did you specify the correct email?');
      });
    break;
  case 'update-upload-status':
    console.log('Updating upload status');
    // Get the user email, upload ID, and status from the command line
    email = args[1];
    uploadId = args[2];
    status = args[3];
    console.log('-> User Email', email);
    console.log('-> Upload ID', uploadId);
    console.log('-> Status', status);
    // Get the user by email and update the upload status
    getUserByEmail(email)
      .then((user) => {
        console.log('-> User ID', user.id);
        updateUploadStatus(user.id, uploadId, status)
          .then(() => {
            console.log('Updated upload status');
          })
          .catch((err) => {
            console.log('Error updating upload status', err);
          });
      })
      .catch((err) => {
        console.log('Error getting user by email: ', err);
        console.log('User not found. Did you specify the correct email?');
      });
    break;
  case 'import-manifest':
    console.log('Importing manifest');
    // Get the user email, upload ID, and manifest path from the command line
    email = args[1];
    uploadId = args[2];
    manifest_path = args[3];
    console.log('-> User Email', email);
    console.log('-> Upload ID', uploadId);
    console.log('-> Manifest Path', manifest_path);
    // Get the user by email and update the upload status
    getUserByEmail(email)
      .then((user) => {
        console.log('-> User ID', user.id);
        // Check if the upload exists
        uploadExists(user.id, uploadId)
          .then((status) => {
            try {
              if (!status) {
                console.log('Upload does not exist');
                return;
              } else if (status != 1) {
                console.log('Upload is not in the correct state: ', status);
                return;
              }
              // Process the manifest file
              let { root, size, files } =
                processManifestFileV010(manifest_path);
              console.log('-> Root', root);
              console.log('-> Size (GiB)', size);

              // Setup our requests
              let requests = [
                // Put the manifest file in storage
                putManifestFile(user.id, uploadId, manifest_path).then(() => {
                  console.log('Uploaded manifest file');
                }),
                // Update the upload status
                updateUploadStatus(user.id, uploadId, 2).then(() => {
                  console.log('Updated upload status');
                }),
                // Update the upload details
                updateUploadDetails(user.id, uploadId, {
                  root: root,
                  size: size,
                  manifest: 'manifest.json',
                }).then(() => {
                  console.log('Updated upload details');
                }),
              ];
              // Add each file to the upload
              files.forEach((file) => {
                requests.push(
                  addFileToUpload(user.id, uploadId, file).then(() => {
                    console.log('Added file to upload: ', file.name);
                  })
                );
              });
              Promise.all(requests)
                .then(() => {
                  console.log('Imported manifest');
                })
                .catch((err) => {
                  console.log('Error importing manifest', err);
                });
            } catch (err) {
              console.log('Error importing manifest', err);
            }
          })
          .catch((err) => {
            console.log('Error checking if upload exists', err);
          });
      })
      .catch((err) => {
        console.log('Error getting user by email: ', err);
        console.log('User not found. Did you specify the correct email?');
      });
    break;
  case 'terminate-upload':
    console.log('Terminating upload');
    // Get the user email and upload ID from the command line
    email = args[1];
    uploadId = args[2];
    console.log('-> User Email', email);
    console.log('-> Upload ID', uploadId);
    // Get the user by email and update the upload status
    getUserByEmail(email).then((user) => {
      console.log('-> User ID', user.id);
      // Check if the upload exists
      uploadExists(user.id, uploadId).then((status) => {
        try {
          if (!status) {
            console.log('Upload does not exist');
            return;
          } else if (status != 3) {
            console.log('Upload is not in the correct state: ', status);
            return;
          }
          // Update the upload status
          updateUploadStatus(user.id, uploadId, 4).then(() => {
            console.log('Updated upload status');
          });
        } catch (err) {
          console.log('Error terminating upload', err);
        }
      });
    });
    break;
  case 'delete-upload':
    console.log('Deleting upload');
    // Get the user email and upload ID from the command line
    email = args[1];
    uploadId = args[2];
    console.log('-> User Email', email);
    console.log('-> Upload ID', uploadId);
    // Get the user by email and update the upload status
    getUserByEmail(email).then((user) => {
      console.log('-> User ID', user.id);
      // Check if the upload exists
      uploadExists(user.id, uploadId).then((status) => {
        try {
          if (!status) {
            console.log('Upload does not exist');
            return;
          } else if (status !== 4) {
            console.log('Upload is not in the correct state: ', status);
            return;
          }
          // Delete the upload
          deleteUpload(user.id, uploadId).then(() => {
            console.log('Deleted upload');
            // remover the manifest file from storage
            deleteManifestFile(user.id, uploadId).then(() => {
              console.log('Deleted manifest file');
            });
          });
        } catch (err) {
          console.log('Error deleting upload', err);
        }
      });
    });
    break;

  default:
    console.log('No command specified');
    break;
}

const processManifestFileV010 = (manifest_path) => {
  // Open the manifest file as a JSON object
  const manifest = require(manifest_path);
  // Get the uploads root from the first file
  const root = manifest[0].origin_data.original_root;
  if (!root) {
    throw new Error('Invalid manifest file');
  }
  const size_bytes = manifest[0].origin_data.original_metadata.len;
  if (!size_bytes) {
    throw new Error('Invalid manifest file');
  }
  // Get the size in GiB from the size in bytes. Set floor to 1 GiB
  const upload_size = Math.max(Math.floor(size_bytes / 1024 / 1024 / 1024), 1);
  // Read through the manifest
  let files = [];
  for (let i = 0; i < manifest.length; i++) {
    // Get the file metadata
    const object = manifest[i];
    // If the field is not present, skip the file
    if (object.data_processing.File) {
      // Get the path from the origin data
      const path = object.origin_data.original_location;
      // Get the name from the end of the path
      const name = path.split('/').pop();

      // Get the size from the metadata. Floor to 1 GiB
      const file_size = Math.max(
        object.origin_data.original_metadata.len / 1024 / 1024 / 1024
      );
      files.push(new File.File(path, name, file_size));
    }
  }
  return { root, size: upload_size, files };
};
