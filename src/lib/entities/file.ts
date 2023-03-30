import { uid } from 'uid';

export interface IFile {
  // Files are indexed by their id.
  id: string;
  // Files have a path.
  path: string;
  // They have user defined names.
  name: string;
  // Size of the file in GB.
  size: number;
}

export class File {
  id: string;
  path: string;
  name: string;
  size: number;

  constructor(path: string, name: string, size: number) {
    this.id = uid();
    this.path = path;
    this.name = name;
    this.size = size;
  }

  with_id = (id: string) => {
    this.id = id;
    return this;
  };

  to_interface = (): IFile => {
    return {
      id: this.id,
      path: this.path,
      name: this.name,
      size: this.size,
    };
  };
}

// This is the converter that allows us to convert between the Firestore
export const fileConverter = {
  toFirestore: (file: File) => {
    const iFile = file.to_interface();
    return {
      path: iFile.path,
      name: iFile.name,
      size: iFile.size,
    };
  },
  fromFirestore: (snapshot: any, options: any): File => {
    const data = snapshot.data(options);
    console.log('data', data);
    // Create a file from the interface.
    return new File(data.path, data.name, data.size).with_id(snapshot.id);
  },
};
