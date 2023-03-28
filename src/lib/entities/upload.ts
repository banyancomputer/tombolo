interface Upload {
  id: string;
  name: string;
  size: number;
  status: number;
  root: string;
  files: File[]
}

export default Upload;
