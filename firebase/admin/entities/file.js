const { uid } = require('uid');

/*
 * This is a File that exists in Firestore. It is used to store metadata about a file
 * Files are indexed by their id. A file is stored in Firestore at:
 *  /users/{user_id}/uploads/{upload_id}/files/{file.id}
 */
class File {
  constructor(path, name, size) {
    // We generate a unique id for the file
    this.id = uid();
    // The path of the file in the upload within the root directory specified in the upload
    this.path = path;
    // The file name
    this.name = name;
    // The raw size of the file in bytes
    this.size = size;
  }

  // Set the id of the file. Use when making a file representation from a Firestore document
  with_id = (id) => {
    this.id = id;
  };

  // Convert the file to an interface that can be used to store in Firestore
  to_interface = () => {
    return {
      path: this.path,
      name: this.name,
      size: this.size,
    };
  };
}

// This is the converter that allows us to convert between the Firestore
const fileConverter = {
  // Convert the file to a Firestore document
  toFirestore: (file) => {
    return file.to_interface();
  },
  // Convert the Firestore document to a file.
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new File(data.path, data.name, data.size).with_id(snapshot.id);
  },
};

module.exports = { File, fileConverter };
