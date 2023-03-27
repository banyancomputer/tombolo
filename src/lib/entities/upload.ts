import RTFile from '@/lib/entities/file';

interface Upload {
  id: string;
  name: string;
  size: number;
  status: number;
  root: string;
  files: RTFile[];
}

export default Upload;
