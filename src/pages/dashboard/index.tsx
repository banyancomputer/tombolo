import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { db } from '@/lib/firebase/admin';
import SideNav from '@/components/navs/side/SideNav';
import nookies from 'nookies';
import admin from '@/lib/firebase/admin';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  AddIcon,
  ArrowBackIcon,
  ChevronDownIcon,
  HamburgerIcon,
  SearchIcon,
} from '@chakra-ui/icons';
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
import NoUpload from '@/components/utils/screens/NoUpload';
// import FullScreenLoader from '../common/FullScreenLoader';
import BrandLogo from '@/images/icons/BrandLogo';
import BrandWordmark from '@/images/icons/BrandWordmark';
import Hamburger from '@/images/icons/Hamburger';
import AlphaTag from '@/images/tags/AlphaTag';
import Upload from '@/lib/entities/upload';
import File from '@/lib/entities/file';

export async function getServerSideProps(ctx: any) {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);
    let { uid, email } = token;
    const uploads = await db.getUploadsByUser(uid);
    const total_size =
      uploads.reduce((acc, upload) => {
        return acc + upload.size;
      }, 0) / 1024;

    return {
      props: {
        uploads: uploads,
        total_size: total_size,
      },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return {
      props: {
        uploads: [] as Upload[],
        total_size: 0,
      },
    };
  }
}

export interface IDashboard {
  uploads: Upload[];
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

const Dashboard: NextPageWithLayout<IDashboard> = ({ uploads, total_size }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log('uploads', uploads);
  // console.log('total_size', total_size);

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
        if (status == 4) {
          // @ts-ignore
          return <Badge colorScheme="red">Terminated</Badge>;
        } else if (row.status == 3) {
          return <Badge colorScheme="green">Stored</Badge>;
        } else if (row.status == 2) {
          return <Badge colorScheme="blue">Upload Scheduled</Badge>;
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
  //
  // const fileViewColumns = [
  //   {
  //     name: 'FILE NAME',
  //     selector: (row: File) => row.name,
  //     sortable: true,
  //     cell: (row: File) => row.name,
  //   },
  //   {
  //     name: 'FILE SIZE',
  //     selector: (row: File) => row.size,
  //     sortable: true,
  //     cell: (row: File) => row.size + ' GiB',
  //   },
  // ];

  const ExpandedComponentOverView = ({ data }: any) => (
    <div className="flex flex-row text-white">
      <button
        className="w-full bg-[#16181B]"
        onClick={() => (window.location.href = '/dashboard/' + data.id)}
      >
        Open File View
      </button>
      <button
        className="w-full bg-[#CB3535] "
        onClick={() =>
          (window.location.href =
            'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87')
        }
      >
        Request Termination
      </button>
    </div>
  );

  // const ExpandedComponentFileView = () => (
  //   <div className="flex flex-row text-white">
  //     <button
  //       className="w-full bg-[#16181B]"
  //       onClick={() =>
  //         (window.location.href =
  //           'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87')
  //       }
  //     >
  //       File Retrieval Request
  //     </button>
  //   </div>
  // );

  return (
    <>
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
                onClick={() =>
                  (window.location.href =
                    'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87')
                }
              >
                New Upload
              </Button>
              <div className="flex gap-4 ml-auto">
                <Button
                  leftIcon={<HamburgerIcon />}
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
                          <Checkbox>Data Prep</Checkbox>
                          <Checkbox>In Progress</Checkbox>
                          <Checkbox>Upload Scheduled</Checkbox>
                          <Checkbox>Terminated</Checkbox>
                        </div>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton className="border-t-2 border-t-black">
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            className="font-bold mb-2 text-xs mt-2"
                          >
                            UPLOAD SIZE
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <RangeSlider
                          aria-label={['min', 'max']}
                          colorScheme="gray"
                          defaultValue={[10, 30]}
                        >
                          <RangeSliderTrack>
                            <RangeSliderFilledTrack />
                          </RangeSliderTrack>
                          <RangeSliderThumb index={0} />
                          <RangeSliderThumb index={1} />
                        </RangeSlider>
                        <div className="flex items-center gap-2 pt-4">
                          <InputGroup size="md">
                            <Input pr="2rem" placeholder="0" />
                            <InputRightElement width="3rem">
                              <p className="text-[#00143140]">TiB</p>
                            </InputRightElement>
                          </InputGroup>
                          <Separator />
                          <InputGroup size="md">
                            <Input pr="2rem" placeholder="1000000" />
                            <InputRightElement width="3rem">
                              <p className="text-[#00143140]">TiB</p>
                            </InputRightElement>
                          </InputGroup>
                        </div>
                        <Button colorScheme="blue" variant="link" size="xs">
                          Clear
                        </Button>
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
                    {/*        UPLOAD DATE*/}
                    {/*      </Box>*/}
                    {/*      <AccordionIcon />*/}
                    {/*    </AccordionButton>*/}
                    {/*  </h2>*/}
                    {/*  <AccordionPanel pb={4}>*/}
                    {/*    <Menu>*/}
                    {/*      <MenuButton*/}
                    {/*        as={Button}*/}
                    {/*        rightIcon={<ChevronDownIcon />}*/}
                    {/*        className="w-full text-left"*/}
                    {/*        variant="outline"*/}
                    {/*      >*/}
                    {/*        Specific Range*/}
                    {/*      </MenuButton>*/}
                    {/*      <MenuList>*/}
                    {/*        <MenuItem>Download</MenuItem>*/}
                    {/*        <MenuItem>Create a Copy</MenuItem>*/}
                    {/*        <MenuItem>Mark as Draft</MenuItem>*/}
                    {/*        <MenuItem>Delete</MenuItem>*/}
                    {/*        <MenuItem>Attend a Workshop</MenuItem>*/}
                    {/*      </MenuList>*/}
                    {/*    </Menu>*/}
                    {/*    <div className="flex items-center gap-2 pt-4">*/}
                    {/*      <div className="w-1/2">*/}
                    {/*        <p className="text-[#00143140] text-xs">From</p>*/}
                    {/*        <Input*/}
                    {/*          placeholder="Select Date"*/}
                    {/*          size="md"*/}
                    {/*          type="date"*/}
                    {/*        />*/}
                    {/*      </div>*/}

                    {/*      <div className="w-1/2">*/}
                    {/*        <p className="text-[#00143140] text-xs">To</p>*/}
                    {/*        <Input*/}
                    {/*          placeholder="Select Date"*/}
                    {/*          size="md"*/}
                    {/*          type="date"*/}
                    {/*        />*/}
                    {/*      </div>*/}
                    {/*    </div>*/}
                    {/*    <Button colorScheme="blue" variant="link" size="xs">*/}
                    {/*      Clear*/}
                    {/*    </Button>*/}
                    {/*  </AccordionPanel>*/}
                    {/*</AccordionItem>*/}

                    {/*<AccordionItem>*/}
                    {/*  <h2>*/}
                    {/*    <AccordionButton className="border-t-2 border-t-black">*/}
                    {/*      <Box*/}
                    {/*        as="span"*/}
                    {/*        flex="1"*/}
                    {/*        textAlign="left"*/}
                    {/*        className="font-bold mb-2 text-xs mt-2"*/}
                    {/*      >*/}
                    {/*        COST-TO-DATE*/}
                    {/*      </Box>*/}
                    {/*      <AccordionIcon />*/}
                    {/*    </AccordionButton>*/}
                    {/*  </h2>*/}
                    {/*  <AccordionPanel*/}
                    {/*    pb={4}*/}
                    {/*    className="border-b-2 border-b-black"*/}
                    {/*  >*/}
                    {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit,*/}
                    {/*    sed do eiusmod tempor incididunt ut labore et dolore*/}
                    {/*    magna aliqua. Ut enim ad minim veniam, quis nostrud*/}
                    {/*    exercitation ullamco laboris nisi ut aliquip ex ea*/}
                    {/*    commodo consequat.*/}
                    {/*  </AccordionPanel>*/}
                    {/*</AccordionItem>*/}
                  </Accordion>
                </DrawerBody>
                <DrawerFooter
                  borderTopWidth="2px"
                  borderTopColor="black"
                  className="mt-12"
                >
                  <Button colorScheme="black" variant="outline" mr="auto">
                    Clear All
                  </Button>
                  <Button bgColor="#000" textColor="white" variant="white">
                    Save Filters
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <DataTable
            columns={overviewColumns}
            data={uploads}
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={ExpandedComponentOverView}
          />
        </>
      ) : (
        <NoUpload />
      )}
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
