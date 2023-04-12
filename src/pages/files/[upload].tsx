import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { File } from '@/lib/entities/file';
import NoFileScreen from '@/components/utils/screens/NoFileScreen';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { db, storage } from '@/lib/firebase/client';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import StatBoxes from '@/components/items/nav/StatBoxes';
import FileStatus from '@/functions/FileStatus';
import CustomerList from '@/functions/CustomerList';
import StatusBadge from '@/functions/StatusBadge';
import Filter from '@/images/icons/Filter';
import FilterDrawer from '@/components/filters/FilterDrawer';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [minSize, setMinSize] = useState<number>(0);
  const [maxSize, setMaxSize] = useState<number>(Infinity);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

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

  const applyFilters = () => {
    let filtered = files;

    if (minSize > 0 || maxSize > 0) {
      filtered = files.filter(
        (file) => file.size >= minSize && (maxSize <= 0 || file.size <= maxSize)
      );
    }

    if (searchQuery !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.id.toLowerCase().includes(query)
      );
      console.log('search');
    }

    return filtered;
  };

  // @ts-ignore
  return (
    <AuthorizedRoute>
      {files.length > 0 ? (
        <div className="overflow-auto">
          {isMobile ? (
            <>
              <div className="p-6">
                <StatBoxes
                  isDesktop={false}
                  firstBox="Total Upload Size"
                  firstStat={Math.round(total_size * 100) / 100}
                  secondBox="Number of Files"
                  secondStat={files.length}
                />
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
                <div className="flex flex-col items-center text-lg mt-4 font-medium justify-center">
                  {upload?.name}
                  <div className="text-xs text-slate-400">
                    {FileStatus(upload?.status)}
                  </div>
                </div>

                <div className="mt-6 border-t border-t-black border-b border-b-black flex py-2">
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon />
                    </InputLeftElement>
                    <Input
                      width="auto"
                      type="search"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    leftIcon={<Filter />}
                    onClick={onOpen}
                    colorScheme="black"
                    variant="outline"
                  >
                    Filter
                  </Button>
                </div>
                <FilterDrawer
                  onClose={onClose}
                  isOpen={isOpen}
                  firstFilterName="SIZE"
                  clearAll={() => {
                    setMinSize(0);
                    setMaxSize(0);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p>Minimum Size (GiB):</p>
                    <Input
                      type="number"
                      value={minSize > 0 ? minSize : ''}
                      onChange={(e) => setMinSize(Number(e.target.value))}
                    />

                    <p>Maximum Size (GiB):</p>
                    <Input
                      type="number"
                      value={maxSize > 0 ? maxSize : ''}
                      onChange={(e) => setMaxSize(Number(e.target.value))}
                    />
                  </div>
                </FilterDrawer>

                <CustomerList
                  data={applyFilters()}
                  onClick={() =>
                    (window.location.href =
                      'https://share.hsforms.com/1OdmJPpFISTOxRp8SU2YfUge3p87')
                  }
                />
              </div>
            </>
          ) : (
            <>
              <StatBoxes
                firstBox="Total Upload Size"
                firstStat={Math.round(total_size * 100) / 100}
                secondBox="Number of Files"
                secondStat={files.length}
              />
              <div className="border-t-2 border-t-[#000] pb-44">
                <div className="flex mt-4">
                  {/* @ts-ignore */}
                  <Button
                    ml={4}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => router.push('/')}
                  >
                    <ArrowBackIcon />
                    All Uploads
                  </Button>

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
                  <div className="flex ml-auto gap-4">
                    <Button
                      leftIcon={<Filter />}
                      onClick={onOpen}
                      colorScheme="black"
                      variant="outline"
                      bgColor="white"
                      borderColor="white"
                    >
                      Filter
                    </Button>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon />
                      </InputLeftElement>
                      <Input
                        width="auto"
                        type="search"
                        placeholder="Search"
                        bgColor="white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
                <FilterDrawer
                  onClose={onClose}
                  isOpen={isOpen}
                  firstFilterName="SIZE"
                  clearAll={() => {
                    setMinSize(0);
                    setMaxSize(0);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p>Minimum Size (GiB):</p>
                    <Input
                      type="number"
                      value={minSize > 0 ? minSize : ''}
                      onChange={(e) => setMinSize(Number(e.target.value))}
                    />

                    <p>Maximum Size (GiB):</p>
                    <Input
                      type="number"
                      value={maxSize > 0 ? maxSize : ''}
                      onChange={(e) => setMaxSize(Number(e.target.value))}
                    />
                  </div>
                </FilterDrawer>

                <div className="flex">
                  <div className="absolute mt-28 ml-4 text-xl font-semibold flex items-center">
                    <div>{upload?.name}</div>
                    <div className="text-sm ml-2">
                      {StatusBadge(upload?.status)}
                    </div>
                  </div>
                </div>
              </div>

              <DataTable
                columns={fileViewColumns}
                data={applyFilters()}
                customStyles={customStyles}
                expandableRows
                expandableRowsComponent={ExpandedComponentFileView}
              />
            </>
          )}
        </div>
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
