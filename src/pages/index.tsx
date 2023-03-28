import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { db } from '@/lib/firebase/client';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { AddIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import Separator from '@/images/icons/Separator';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  useDisclosure,
} from '@chakra-ui/react';
import NoUploadScreen from '@/components/utils/screens/NoUploadScreen';
import { Upload } from '@/lib/entities/upload';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import Filter from '@/images/icons/Filter';

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

  useEffect(() => {
    if (user) {
      db.getUploads(user.uid)
        .then((uploads) => {
          setUploads(uploads);
          setTotalSize(uploads.reduce((a, b) => a + b.size, 0) / 1024);
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
        if (status == 3) {
          // @ts-ignore
          return <Badge colorScheme="red">Terminated</Badge>;
        } else if (row.status == 2) {
          return <Badge colorScheme="green">Stored</Badge>;
        } else if (row.status == 1) {
          return <Badge colorScheme="blue">Data Prep</Badge>;
        } else {
          return <Badge>Upload Requested</Badge>;
        }
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
    }
    return filtered;
  };

  return (
    <AuthorizedRoute>
      {uploads.length > 0 ? (
        <>
          <div className="relative flex h-36">
            <div className="w-full border-r-2 border-r-[#000] p-4">
              Data Stored
              <div className="absolute bottom-0 text-black font-medium text-xl mb-2 ">
                {total_size > 0 ? total_size : 0} TiB
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
                    type="tel"
                    placeholder="Search"
                    bgColor="white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </div>
            </div>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay bgColor="#16181BE5" />
              <DrawerContent>
                <h1 className="text-xl mt-12 mb-2 ml-2 font-medium">Filters</h1>
                <DrawerBody p={0}>
                  {/* thea: use mapping function when cleaning up */}
                  <Accordion allowMultiple className="border-b border-b-black">
                    <AccordionItem>
                      <h2>
                        <AccordionButton className="border-t-2 border-t-black pt-4 pb-4">
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            className="font-bold mb-2 text-xs mt-2"
                          >
                            STATUS
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
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
                      </AccordionPanel>
                    </AccordionItem>

                    {/*<AccordionItem>*/}
                    {/*  <h2>*/}
                    {/*    <AccordionButton className="border-t-2 border-t-black">*/}
                    {/*      <Box*/}
                    {/*        as="span"*/}
                    {/*        flex="1"*/}
                    {/*        textAlign="left"*/}
                    {/*        className="font-bold mb-2 text-xs mt-2"*/}
                    {/*      >*/}
                    {/*        UPLOAD SIZE*/}
                    {/*      </Box>*/}
                    {/*      <AccordionIcon />*/}
                    {/*    </AccordionButton>*/}
                    {/*  </h2>*/}
                    {/*  <AccordionPanel pb={4}>*/}
                    {/*    <div className="flex flex-col gap-1">*/}
                    {/*      <Checkbox>less than 10TiB</Checkbox>*/}
                    {/*      <Checkbox>10-1000TiB</Checkbox>*/}
                    {/*      <Checkbox>1001-99999TiB</Checkbox>*/}
                    {/*      <Checkbox>more than 10000TiB</Checkbox>*/}
                    {/*    </div>*/}
                    {/*  </AccordionPanel>*/}
                    {/*</AccordionItem>*/}
                  </Accordion>
                </DrawerBody>
                <DrawerFooter
                  borderTopWidth="2px"
                  borderTopColor="black"
                  className="mt-12"
                >
                  {/* add clear all */}
                  <Button
                    colorScheme="black"
                    variant="outline"
                    mr="auto"
                    onClick={() => setStatusFilter([])}
                  >
                    Clear All
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <DataTable
            columns={overviewColumns}
            // data={uploads}
            data={applyFilters()} // thea: remove this
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={ExpandedComponentOverView}
          />
        </>
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
