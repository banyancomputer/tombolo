const { uid } = require('uid');
class Upload {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.size = 0;
    this.status = 0;
    this.root = '';
    this.manifest = '';
  }

  with_id = (id) => {
    this.id = id;
    return this;
  };

  with_size = (size) => {
    this.size = size;
    return this;
  };

  with_status = (status) => {
    this.status = status;
    return this;
  };

  with_root = (root) => {
    this.root = root;
    return this;
  };

  with_manifest = (manifest) => {
    this.manifest = manifest;
    return this;
  };

  to_interface = () => {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      status: this.status,
      root: this.root,
      manifest: this.manifest,
    };
  };
}

// This is the converter that allows us to convert between the Firestore
const uploadConverter = {
  toFirestore: (upload) => {
    const iUpload = upload.to_interface();
    return {
      name: iUpload.name,
      size: iUpload.size,
      status: iUpload.status,
      root: iUpload.root,
      manifest: iUpload.manifest,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    // Create an upload from the interface.
    return new Upload(data.name)
      .with_id(snapshot.id)
      .with_size(data.size)
      .with_status(data.status)
      .with_root(data.root)
      .with_manifest(data.manifest);
  },
};

module.exports = { Upload, uploadConverter };
