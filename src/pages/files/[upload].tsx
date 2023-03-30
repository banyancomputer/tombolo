import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { File } from '@/lib/entities/file';
import NoFileScreen from '@/components/utils/screens/NoFileScreen';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { db, storage } from '@/lib/firebase/client';
import { Badge } from '@chakra-ui/react';
import AuthorizedRoute from '@/components/utils/routes/Authorized';

export interface IFileView {}

const customStyles = {
  headRow: {
    style: {
      borderTopWidth: '2px',
      borderTopColor: '#000',
      borderTopStyle: 'solid',
      borderBottomWidth: '2px',
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      fontWeight: 700,
    },
  },
};

const FileView: NextPageWithLayout<IFileView> = ({}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [upload, setUpload] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [total_size, setTotalSize] = useState<number>(0);
  const [manifestUrl, setManifestUrl] = useState<string>('');

  useEffect(() => {
    // Get the upload ID from the URL. Its the last part of the URL
    const upload_id = router.asPath.split('/').pop();
    if (upload_id && user) {
      // Get the uploads from the backend
      db.getFiles(user?.uid, upload_id).then((files) => {
        console.log(files);
        // Set the files
        setFiles(files);
        // Calculate the total size of the upload
        let total_size = 0;
        files.forEach((file) => {
          console.log(
            file.size + '+' + total_size,
            ' = ',
            file.size + total_size
          );
          total_size += file.size;
        });
        console.log('total_size: ', total_size);
        // Set the total size in TB
        setTotalSize(total_size / 1024);
        console.log('upload_id: ', upload_id);
      });
    }
  }, [user, router]);

  useEffect(() => {
    // Get the upload ID from the URL. Its the last part of the URL
    const upload_id = router.asPath.split('/').pop();
    if (upload_id && user) {
      // Get the uploads from the backend
      storage
        .getManifestUrl(user?.uid, upload_id)
        .then((manifest) => {
          console.log(manifest);
          // Set the files
          setManifestUrl(manifest);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, router]);

  useEffect(() => {
    // Get the upload ID from the URL. Its the last part of the URL
    const upload_id = router.asPath.split('/').pop();
    if (upload_id && user) {
      // Get the uploads from the backend
      db.getUpload(user?.uid, upload_id)
        .then((upload) => {
          console.log(upload);
          // Set the files
          setUpload(upload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, router]);

  const fileViewColumns = [
    {
      name: 'FILE NAME',
      selector: (row: File) => row.name,
      sortable: true,
      cell: (row: File) => row.name,
    },
    {
      name: 'FILE SIZE',
      selector: (row: File) => row.size,
      sortable: true,
      cell: (row: File) => row.size + ' GiB',
    },
  ];

  const ExpandedComponentFileView = () => (
    <div className="flex flex-row text-white">
      <button
        className="w-full bg-[#16181B]"
        onClick={() =>
          (window.location.href =
            'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87')
        }
      >
        File Retrieval Request
      </button>
    </div>
  );

  // @ts-ignore
  return (
    <AuthorizedRoute>
      {files.length > 0 ? (
        <>
          <div className="relative flex h-36">
            <div className="w-full border-r-2 border-r-[#000] p-4">
              Total Upload Size
              <div className="absolute bottom-0 text-black font-medium text-xl mb-2 ">
                {/* Round TiBs to the nearst .01 Tib*/}
                {Math.round(total_size * 100) / 100} TiB
              </div>
            </div>
            <div className="w-full border-r-2 border-r-[#000] p-4">
              Number of Files
              <div className="absolute bottom-0 font-medium text-xl mb-2">
                {files.length}
              </div>
            </div>
          </div>
          <div className="border-t-2 border-t-[#000] pb-44">
            <div className="flex mt-4">
              {/* @ts-ignore */}
              <Button
                ml={4}
                colorScheme="blue"
                variant="solid"
                onClick={() => router.push('/') /* change to dashboard */}
              >
                <ArrowBackIcon />
                All Uploads
              </Button>
              {/*</div>*/}
              {/*<div className="flex mt-4">*/}
              {/* @ts-ignore */}
              <Button
                ml={4}
                colorScheme="blue"
                variant="solid"
                onClick={
                  // Download from the manifest URL
                  () => window.open(manifestUrl, '_blank')
                }
              >
                Download Manifest
              </Button>
            </div>
            <div className="flex mt-4">
              <div className="absolute mt-28 ml-4 text-xl font-semibold flex items-center">
                {/* change to upload name */}
                <div>{upload?.name}</div>
                <div className="text-sm ml-2">
                  <Badge colorScheme="green">Stored</Badge>
                </div>
              </div>
            </div>
          </div>

          <DataTable
            columns={fileViewColumns}
            data={files} // for alex: change to file data
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={ExpandedComponentFileView}
          />
        </>
      ) : (
        <NoFileScreen />
      )}
    </AuthorizedRoute>
  );
};

export default FileView;

FileView.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
