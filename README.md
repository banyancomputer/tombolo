# Tombolo

Tombolo is a key management service meant to be used with Banyan's `dataprep` tool.
This repository contains

- A Yarn based NextJS application that serves as our frontend. This frontend is meant to be used with the firebase project described in `.env`
- A Firebase project that defines rules and indexes for:
  - Firebase Authentication
  - Firestore Database
  - Cloud Storage
- An interim admin tool for interacting with the Firebase project, both as a deployed service and a local emulator. It is meant to serve as a temporary solution until we can implement a more robust way of managing user data in the Firebase project.

## Dependencies

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- Next.js
- Firebase CLI

## Features and Current Functionality

- [x] User Authentication: A user can login with their email and password.
- [x] User Registration: A user can register with their email and password, and other information.
- [x] User Profile: A user can view and edit their profile. Their user is stored in Firestore at `/users/{uid}`.
- [x] Upload Requesting: A user can request a new upload
- [x] Upload Listing: A user can view their uploads
- [x] Upload Management: An admin user can update a users upload and cycle it through the upload lifecycle.
- [x] File listing: A user can view the files that are attached to an upload, once it has been processed and in the `Dataprep` stage.

## Configuration

### Frontend

The NextJS application is configured using environment variables. These are defined in `.env`.
You should not need to change any of these variables. They describe the Firebase project that the frontend is meant to interact with.
They should also work with emulators.

Be sure to install dependencies before running the frontend:

```bash
yarn install
```

### Firebase

The Firebase project described in `/firebase` is configured to track our deployed Firebase project.
The directory is already populated with dummy data that should work with the frontend.
For developing, you shouldn't need to log in or configure anything. You can just need to download and run the emulators.

### Admin Tool

You shouldn't need to configure anything for running the admin tool against the emulated Firebase project.
You just need to copy the `.env.example` file to `.env` in `/firebase/admin` and run the commands specified in the README there.

## Data Structures and Storage Norms with Firebase

We have four main data structures in our Firebase project:

- Users: These hold information about users outside of authentication.
  - They are stored at `/users/{uid}` in Firestore. They are protected and accessible only to the user who created them.
  - They have:
    - `email`: The email address of the user.
    - `name`: The name of the user.
    - `fullName`: The full name of the user.
    - `companyName`: The name of the company the user works for.
    - `jobTitle`: The job title of the user.
    - `phoneNumber`: The phone number of the user
- `uploads`: These describe a single run of the `dataprep` tool on a dataset or filesystem. They are protected and accessible only to the user who created them.
  - They are stored at `/users/{uid}/uploads/{uploadId}` in Firestore.
  - They have:
    - `name`: The name of the upload.
    - `status`: The status of the upload as an inte
    - `size`: The size of the upload in bytes.
    - `root`: The root directory of the upload.
    - `manifest`: The path to the manifest file for the upload in Cloud Storage (This might be redundant).
- `Files`: These describe files processed by `dataprep` in a given upload. They are protected and accessible only to the user who created the upload.
  - They are stored at `/users/{uid}/uploads/{uploadId}/files/{fileId}` in Firestore.
  - They have:
    - `name`: The name of the file.
    - `path`: The path of the file.
    - `size`: The size of the file in bytes.
- `Manifests`: Manifest files are the main artefact (other than packed filesystems). They describe the keys used to encrypt a dataset.
  - Each is associated with a single upload. They are protected and accessible only to the user who created the upload.
  - Each is stored at `manifests/{uid}/{uploadId}/manifest.json` in Cloud Storage.
  - They are what let us automatically populate an upload with the correct files when a user requests a new upload.

## A note on version control and Migration

The only changes we can version control with this repository are:

- The frontend code in `/src`. This changes the implementation of the frontend.
- The Firebase project configuration in `/firebase`. This changes in what ways a client can interact with the Firebase project.

We don't attempt to implement migrations outside of this repository. If you make a valid change to they way we store data in the Firebase project, you will
need to implement error handling in the frontend to handle the old and new data structures.

## Development

### Frontend

You should be able to make frontend changes confidently without worrying about breaking backend functionality so long as you use the Firebase utilities provided in `/src/lib/firebase/client` correctly.
You can run the frontend locally using the following command:

```bash
yarn dev
```

This will run the frontend on `localhost:3000`.
In order to test functionality, you will need to run the Firebase emulators. See below.

### Firebase

You can run the Firebase emulators locally using the following command:

```bash
cd firebase
firebase emulators:start --import emulator
```

This starts the emulators and imports the data from `/firebase/emulator`. You can interact with the emulators at `localhost:5000`.

The authentication service will start with a user with the email `populated@tombolo.store` and password `hellotombolo`.
This user has example uploads in different states attached to it to help you test changes to the frontend.

The authenticaiton service will also start with a user with the email `empty@tombolo.store` and password `hellotombolo`.
This user has no uploads attached to it. You can use this user to test the upload flow and see empty states.

You should be able to develop Firebase service, rules, and indexes using this base configuration.
Changes you make to the emulated Firebase project will be saved to `/firebase` and can be deployed to production later.
Changing these will affect the ways users can read and write data to the Firebase project from the frontend. It will not change the functionality of the frontend or admin tool.

### Admin Tool

You can use the Admin Tool to populate the Firebase project with dummy data in a format that the frontend expects.
See the README in `/firebase/admin` for more information.

If you want to save the data you create in the admin tool to the `/firebase` directory, you can must run the following command:

```bash
cd firebase
firebase emalators:start --import emulator --export-on-exit emulator
```

This will both import the base data from `/firebase/emulator` and export any changes you make to the emulators to `/firebase/emulator`.
Commit these changes to the repository if they are necessary for testing or populating a new frontend view.

#### A note on changes to the Admin Tool

The admin tool is a quick and hacky way to populate the Firebase project with data.
You should not need to make any changes to the admin tool. You only need to change it if you update the way we store data in the Firebase project.
If you find yourself making edits to this tool, please consider if there is a better way to do what you are trying to do / means you want to change how a datastructure is stored or retrieved.

## Testing

We are using Cypress to test. The frontend should be running locally prior to testing.

To install and open Cypress, run the following commands:

```bash
yarn add cypress --dev
yarn run cypress open
```

Running these commands will open the Launchpad. We're currently using E2E testing, where we test whole pages. You don't need to configure any files and you can chose your preferred browser to test.

To create your first test, go to "Create new empty spec". Cypress monitors your spec files for any changes and automatically displays any changes.

Our test files are in cypress/e2e. Create a file ending in ```.cy.ts``` and the spec file will automatically show up in your list of e2e specs. 

## Deployment

### Frontend

This repository is set up to deploy the frontend to Vercel on every push to `main`.

### Firebase

You can deploy the Firebase project to production using the following command:

```bash
cd firebase
firebase deploy
```

You should only be able to do that if you are me
We will only ever deploy when were are sure something is ready to be deployed.

- Alex
