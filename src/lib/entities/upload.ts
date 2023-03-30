import { uid } from 'uid';
export interface IUpload {
  // Uploads have randomly generated IDs.
  id: string;
  // They have user defined names.
  name: string;
  // Size of the upload in GB.
  size: number;
  // Status of the upload.
  // 0: Requested
  // 1: Prepping
  // 2: Stored
  // 3: Terminated
  status: number;
  // Root directory of the upload.
  root: string;
  // A url to the manifest file.
  manifest: string;
}

export class Upload {
  id: string;
  name: string;
  size: number;
  status: number;
  root: string;
  manifest: string;

  constructor(name: string) {
    this.id = uid();
    this.name = name;
    this.size = 0;
    this.status = 0;
    this.root = '';
    this.manifest = '';
  }

  with_id = (id: string) => {
    this.id = id;
    return this;
  };

  with_size = (size: number) => {
    this.size = size;
    return this;
  };

  with_status = (status: number) => {
    this.status = status;
    return this;
  };

  with_root = (root: string) => {
    this.root = root;
    return this;
  };

  with_manifest = (manifest: string) => {
    this.manifest = manifest;
    return this;
  };

  to_interface = (): IUpload => {
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
export const uploadConverter = {
  toFirestore: (upload: Upload) => {
    const iUpload = upload.to_interface();
    return {
      name: iUpload.name,
      size: iUpload.size,
      status: iUpload.status,
      root: iUpload.root,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
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
