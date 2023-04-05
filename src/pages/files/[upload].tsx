import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { File } from '@/lib/entities/file';
import NoFileScreen from '@/components/utils/screens/NoFileScreen';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { db, storage } from '@/lib/firebase/client';
import { Badge } from '@chakra-ui/react';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import NavMobile from '@/components/navs/side/NavMobile';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const CustomerCard = ({ id, name, status, size, data }: any) => {
    const getStatusBadge = (status) => {
      if (status == 3) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> Stored <ArrowForwardIcon />
            <div className="font-bold"> Terminated </div>
          </div>
        );
      } else if (status == 2) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> <div className="font-bold"> Stored </div>
            <ArrowForwardIcon /> Terminated
          </div>
        );
      } else if (status == 1) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon />
            <div className="font-bold">Data Prep </div>
            <ArrowForwardIcon /> Stored <ArrowForwardIcon /> Terminated
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center">
            <div className="font-bold">Requested</div>
            <ArrowForwardIcon /> Data Prep <ArrowForwardIcon /> Stored
            <ArrowForwardIcon /> Terminated
          </div>
        );
      }
    };
    return (
      <div className="bg-white mt-4">
        <div className="flex border-b">
          <div className="p-3 text-lg border-r grow truncate">
            {name}
            <div className="text-xs text-slate-400">{size}</div>
          </div>
          <Menu>
            <MenuButton
              as={IconButton}
              className="m-auto mx-4"
              aria-label="Options"
              icon={<BsThreeDots />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                icon={<AiOutlineFolderOpen />}
                onClick={() =>
                  (window.location.href =
                    'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87')
                }
              >
                File Retrieval Request
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="text-xs text-slate-400 p-3">
          Upload ID
          <div className="text-black truncate"> {id}</div>
        </div>
      </div>
    );
  };
  const CustomerList = ({ data }: any) => {
    return (
      <div>
        {data.map((customer) => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            status={customer.status}
            size={customer.size + ' GiB'}
          />
        ))}
      </div>
    );
  };

  // @ts-ignore
  return (
    <AuthorizedRoute>
      {files.length > 0 ? (
        <>
          <div className="xs:hidden lg:block">
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
                  <div>{upload?.name}</div>
                  <div className="text-sm ml-2">
                    {/* change to upload status */}
                    <Badge colorScheme="green">{upload?.status}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              columns={fileViewColumns}
              data={files}
              customStyles={customStyles}
              expandableRows
              expandableRowsComponent={ExpandedComponentFileView}
            />
          </div>
          <div className="xs:block lg:hidden">
            <NavMobile />
            <div className="p-6">
              <div className="flex flex-row gap-2 pt-2 relative">
                <div className="bg-white p-3 w-full font-medium">
                  <div className="text-slate-400"> Total Upload Size</div>
                  <div className="text-xl mt-2">
                    {Math.round(total_size * 100) / 100} TiB
                  </div>
                </div>
                <div className="bg-white p-3 w-full font-medium">
                  <div className="text-slate-400"> Number of Files</div>
                  <div className="text-xl mt-2">{files.length}</div>
                </div>
              </div>
              <div className="flex mt-4 justify-between">
                {/* @ts-ignore */}
                <Button
                  ml={4}
                  size="xs"
                  colorScheme="black"
                  variant="outline"
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
                  size="xs"
                  bgColor="black"
                  textColor="white"
                  variant="solid"
                  onClick={
                    // Download from the manifest URL
                    () => window.open(manifestUrl, '_blank')
                  }
                >
                  Download Manifest
                </Button>
              </div>
              <div className="flex text-lg mt-4 font-medium justify-center">
                {upload?.name}
              </div>
              {/* this is where upload status goes */}
              {/* dummy  */}
              <div className="flex items-center justify-center text-xs text-slate-400">
                Requested <ArrowForwardIcon /> Data Prep
                <ArrowForwardIcon /> <div className="font-bold"> Stored </div>
                <ArrowForwardIcon /> Terminated
              </div>
              {/* dummy end */}

              <div className="mt-2 border-t border-t-black border-b border-b-black flex py-2">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon />
                  </InputLeftElement>
                  <Input
                    className="grow"
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </div>

              <CustomerList data={files} />
            </div>
          </div>
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
