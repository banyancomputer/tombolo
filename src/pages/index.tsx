import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { db } from '@/lib/firebase/client';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  AddIcon,
  ArrowForwardIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  Icon,
  RepeatIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineFolderOpen } from 'react-icons/ai';
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
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  useDisclosure,
} from '@chakra-ui/react';
import NoUploadScreen from '@/components/utils/screens/NoUploadScreen';
import { Upload } from '@/lib/entities/upload';
import { useAuth } from '@/contexts/auth';
import router, { useRouter } from 'next/router';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import Filter from '@/images/icons/Filter';
import BrandLogo from '@/images/icons/BrandLogo';
import BrandWordmark from '@/images/icons/BrandWordmark';
import Hamburger from '@/images/icons/Hamburger';
import AlphaTag from '@/images/tags/AlphaTag';
import NewDeal from '@/images/icons/NewDeal';
import NavMobile from '@/components/navs/side/NavMobile';

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
              onClick={() => router.push('/files/' + data.id)}
            >
              Open File View
            </MenuItem>
            <MenuItem
              icon={<DeleteIcon />}
              onClick={() =>
                (window.location.href =
                  'https://share.hsforms.com/143jPAVGURWODS_QtCkFJtQe3p87')
              }
            >
              Request Termination
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="border-b text-center text-xs text-slate-400">
        {getStatusBadge(status)}
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
          <div className="xs:hidden lg:block">
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
              <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay bgColor="#16181BE5" />
                <DrawerContent>
                  <h1 className="text-xl mt-12 mb-2 ml-2 font-medium">
                    Filters
                  </h1>
                  <DrawerBody p={0}>
                    {/* thea: use mapping function when cleaning up */}
                    <Accordion
                      allowMultiple
                      className="border-b border-b-black"
                    >
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
              data={applyFilters()}
              customStyles={customStyles}
              expandableRows
              expandableRowsComponent={ExpandedComponentOverView}
            />
          </div>
          <div className="xs:block lg:hidden">
            <NavMobile />
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
                  variant="ghost"
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
              <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay bgColor="#16181BE5" />
                <DrawerContent>
                  <h1 className="text-xl mt-12 mb-2 ml-2 font-medium">
                    Filters
                  </h1>
                  <DrawerBody p={0}>
                    {/* thea: use mapping function when cleaning up */}
                    <Accordion
                      allowMultiple
                      className="border-b border-b-black"
                    >
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
              <CustomerList data={applyFilters()} />
            </div>
          </div>
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
