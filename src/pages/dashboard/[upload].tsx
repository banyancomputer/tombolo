import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { db } from '@/lib/firebase/admin';
import nookies from 'nookies';
import admin from '@/lib/firebase/admin';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Separator from '@/images/icons/Separator';
import { Badge, Button } from '@chakra-ui/react';
import NoUpload from '@/components/utils/screens/NoUpload';
// import FullScreenLoader from '../common/FullScreenLoader';
import BrandLogo from '@/images/icons/BrandLogo';
import BrandWordmark from '@/images/icons/BrandWordmark';
import Hamburger from '@/images/icons/Hamburger';
import AlphaTag from '@/images/tags/AlphaTag';
import Upload from '@/lib/entities/file';
import File from '@/lib/entities/file';
import NoFile from '@/components/utils/screens/NoFile';

export async function getServerSideProps(ctx: any) {
  // Get the Upload ID from the URL
  const uploadId = ctx.query.upload;
  console.log('ctx', ctx);
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);
    let { uid, email } = token;
    const uploads = await db.getUploadsByUser(uid);
    console.log('uploadID: ', uploadId);
    console.log(uploads);
    // Check if the requested file is owned by the user
    const uploadExists = uploads.some((upload) => upload.id === uploadId);
    console.log(uploadExists);

    if (!uploadExists) {
      return {
        props: {
          files: [] as File[],
          total_size: 0,
        },
      };
    }

    const files = await db.getFilesByUpload(uploadId);
    const total_size =
      files.reduce((acc, file) => {
        // @ts-ignore
        return acc + file.size;
      }, 0) / 1024;

    return {
      props: {
        files: files,
        total_size: total_size,
      },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return {
      props: {
        files: [] as Upload[],
        total_size: 0,
      },
    };
  }
}

export interface IFileView {
  files: File[];
  total_size: number;
}

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

const FileView: NextPageWithLayout<IFileView> = ({ files, total_size }) => {
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
            'https://share.hsforms.com/1OdmJPpFISTOxRp8SU2YfUge3p87')
        }
      >
        File Retrieval Request
      </button>
    </div>
  );

  // @ts-ignore
  console.log(files);
  return (
    <>
      {files.length > 0 ? (
        <>
          <div className="relative flex h-36">
            <div className="w-full border-r-2 border-r-[#000] p-4">
              Total Upload Size
              <div className="absolute bottom-0 text-black font-medium text-xl mb-2 ">
                {total_size} TiB
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
                bg="white"
                textColor={'blue.500'}
                variant="solid"
                onClick={
                  () =>
                    (window.location.href =
                      '/dashboard') /* change to dashboard */
                }
              >
                <ArrowBackIcon />
                All Uploads
              </Button>
            </div>
            <div className="absolute mt-28 ml-4 text-xl font-semibold flex items-center">
              {/* change to upload name */}
              pet-pics
              <div className="text-sm ml-2">
                <Badge colorScheme="green">Stored</Badge>
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
        <NoFile />
      )}
    </>
  );
};

export default FileView;

FileView.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
