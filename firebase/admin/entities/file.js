const { uid } = require('uid');
class File {
  constructor(path, name, size) {
    this.id = uid();
    this.path = path;
    this.name = name;
    this.size = size;
  }

  with_id = (id) => {
    this.id = id;
  };

  to_interface = () => {
    return {
      id: this.id,
      path: this.path,
      name: this.name,
      size: this.size,
    };
  };
}

// This is the converter that allows us to convert between the Firestore
const fileConverter = {
  toFirestore: (file) => {
    const iFile = file.to_interface();
    return {
      path: iFile.path,
      name: iFile.name,
      size: iFile.size,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    console.log('data', data);
    // Create a file from the interface.
    return new File(data.path, data.name, data.size).with_id(snapshot.id);
  },
};

module.exports = { File, fileConverter };
