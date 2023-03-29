# Tombolo Firebase Admin
This is a tool for interacting with the Tombolo Firebase database and storage.

## Dependencies
- Node
- Yarn

## Setup
Install dependencies with
```bash
yarn install
```

Copy `.env.example` to `.env` and fill in the values.
You will need to create a service account for the Firebase project and import the service account credentials JSON file your 
environment.

The example file should be able to interact with Emulated Firebase without any changes.

## Usage

### Initializing an upload for a user
```bash
node index.js initialize-upload <user-email> <upload-name> 
```
Note the upload ID that is returned.

### Importing a Manifest File
This populates a manifest file's data into the database and uploads the file to Firebase Storage.
```bash
node index.js import-manifest <user-email> <upload-id> <manifest-file-path>
```

### Updating the status of an upload
You can change the status of an upload to:
- 0: `UPLOAD_REQUESTED`
- 1: `UPLOAD_PREPPED`
- 2: `UPLOAD_STORED`
- 3: `UPLOAD_TERMINATED`
```bash
node index.js update-upload-status <user-email> <upload-id> <status>
```

### Deleting an upload
Removes the Upload document data from firestore and the manifest file from Firebase Storage.
```bash
node index.js delete-upload <user-email> <upload-id>
```


