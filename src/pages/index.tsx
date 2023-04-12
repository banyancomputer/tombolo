import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { db } from '@/lib/firebase/client';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import NoUploadScreen from '@/components/utils/screens/NoUploadScreen';
import { Upload } from '@/lib/entities/upload';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import Filter from '@/images/icons/Filter';
import NewDeal from '@/images/icons/NewDeal';
import CustomerList from '@/functions/CustomerList';
import StatusBadge from '@/functions/StatusBadge';
import FilterDrawer from '@/components/filters/FilterDrawer';

export interface IDashboard {}

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

const Dashboard: NextPageWithLayout<IDashboard> = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [total_size, setTotalSize] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (user) {
      db.getUploads(user.uid)
        .then((uploads) => {
          setUploads(uploads);
          // Calculate the total size of the upload, to the nearest .01 TB
          setTotalSize(
            (Math.round(uploads.reduce((a, b) => a + b.size, 0) / 1024) * 100) /
              100
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  const overviewColumns = [
    {
      name: 'UPLOAD ID',
      selector: (row: Upload) => row.id,
    },
    {
      name: 'UPLOAD NAME',
      selector: (row: Upload) => row.name,
      sortable: true,
      cell: (row: Upload) => row.name,
    },
    {
      name: 'UPLOAD STATUS',
      selector: (row: Upload) => row.status,
      sortable: true,
      cell: (row: Upload) => {
        const status = row.status;
        return <div>{StatusBadge(status)}</div>;
      },
    },
    {
      name: 'UPLOAD SIZE',
      selector: (row: Upload) => row.size,
      sortable: true,
      cell: (row: Upload) => row.size + ' GiB',
    },
  ];

  const ExpandedComponentOverView = ({ data }: any) => (
    <div className="flex flex-row text-white">
      <button
        className="w-full bg-[#16181B]"
        onClick={() => router.push('/files/' + data.id)}
      >
        Open File View
      </button>
      <button
        className="w-full bg-[#CB3535] "
        onClick={() =>
          (window.location.href =
            'https://share.hsforms.com/143jPAVGURWODS_QtCkFJtQe3p87')
        }
      >
        Request Termination
      </button>
    </div>
  );

  const applyFilters = () => {
    let filtered = uploads;

    if (statusFilter.length > 0) {
      filtered = filtered.filter((item) => statusFilter.includes(item.status));
    }

    if (searchQuery !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
      );
      console.log('search');
    }
    return filtered;
  };

  return (
    <AuthorizedRoute>
      {uploads.length > 0 ? (
        <div className="overflow-auto">
          {isMobile ? (
            <>
              <div className="p-6">
                <div className="bg-white p-3 font-medium">
                  <div className="text-slate-400">Data Stored</div>
                  <div className="text-xl mt-2">{total_size} TiB</div>
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
                <div
                  className="flex text-md items-center bg-white mt-4 justify-center py-2 gap-2"
                  onClick={() => router.push('/upload-portal')}
                >
                  <NewDeal />
                  New Upload
                </div>
                <FilterDrawer
                  onClose={onClose}
                  isOpen={isOpen}
                  firstFilterName="STATUS"
                  clearAll={() => setStatusFilter([])}
                >
                  <div className="flex flex-col gap-1">
                    <Checkbox
                      value={0}
                      isChecked={statusFilter.includes(0)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 0]
                            : prev.filter((status) => status !== 0)
                        )
                      }
                    >
                      Upload Requested
                    </Checkbox>
                    <Checkbox
                      value={1}
                      isChecked={statusFilter.includes(1)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 1]
                            : prev.filter((status) => status !== 1)
                        )
                      }
                    >
                      Data Prep
                    </Checkbox>
                    <Checkbox
                      value={2}
                      isChecked={statusFilter.includes(2)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 2]
                            : prev.filter((status) => status !== 2)
                        )
                      }
                    >
                      Stored
                    </Checkbox>
                    <Checkbox
                      value={3}
                      isChecked={statusFilter.includes(3)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 3]
                            : prev.filter((status) => status !== 3)
                        )
                      }
                    >
                      Terminated
                    </Checkbox>
                  </div>
                </FilterDrawer>
                <CustomerList
                  data={applyFilters()}
                  isFiles={false}
                  onClickDelete={() =>
                    (window.location.href =
                      'https://share.hsforms.com/143jPAVGURWODS_QtCkFJtQe3p87')
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="relative flex h-36">
                <div className="w-full border-r-2 border-r-[#000] p-4">
                  Data Stored
                  <div className="absolute bottom-0 text-black font-medium text-xl mb-2 ">
                    {total_size} TiB
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-t-[#000] pb-44">
                <div className="flex mt-4">
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    variant="solid"
                    ml={4}
                    w={40}
                    onClick={() => router.push('/upload-portal')}
                  >
                    New Upload
                  </Button>
                  <div className="flex gap-4 ml-auto">
                    <Button
                      leftIcon={<Filter />}
                      className=""
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
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        htmlSize={40}
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
                  firstFilterName="STATUS"
                  clearAll={() => setStatusFilter([])}
                >
                  <div className="flex flex-col gap-1">
                    <Checkbox
                      value={0}
                      isChecked={statusFilter.includes(0)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 0]
                            : prev.filter((status) => status !== 0)
                        )
                      }
                    >
                      Upload Requested
                    </Checkbox>
                    <Checkbox
                      value={1}
                      isChecked={statusFilter.includes(1)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 1]
                            : prev.filter((status) => status !== 1)
                        )
                      }
                    >
                      Data Prep
                    </Checkbox>
                    <Checkbox
                      value={2}
                      isChecked={statusFilter.includes(2)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 2]
                            : prev.filter((status) => status !== 2)
                        )
                      }
                    >
                      Stored
                    </Checkbox>
                    <Checkbox
                      value={3}
                      isChecked={statusFilter.includes(3)}
                      onChange={(e) =>
                        setStatusFilter((prev) =>
                          e.target.checked
                            ? [...prev, 3]
                            : prev.filter((status) => status !== 3)
                        )
                      }
                    >
                      Terminated
                    </Checkbox>
                  </div>
                </FilterDrawer>
              </div>
              <DataTable
                columns={overviewColumns}
                data={applyFilters()}
                customStyles={customStyles}
                expandableRows
                expandableRowsComponent={ExpandedComponentOverView}
              />
            </>
          )}
        </div>
      ) : (
        <NoUploadScreen />
      )}
    </AuthorizedRoute>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
