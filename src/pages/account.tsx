import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import nookies from 'nookies';
import admin, { db } from '@/lib/firebase/admin';
import { auth } from '@/lib/firebase/client';

export async function getServerSideProps(ctx: any) {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);
    let { uid, email } = token;
    const user = await db.getUser(uid);
    console.log(user);
    return {
      props: {
        user,
        email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
        jobTitle: user.jobTitle,
      },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return {
      props: {
        placeholder: '' as never,
      },
    };
  }
}

export interface IAccount {
  user: any;
  email: string;
  fullName: string;
  phoneNumber: string;
  companyName: string;
  jobTitle: string;
}

const Account: NextPageWithLayout<IAccount> = ({
  user,
  email,
  fullName,
  companyName,
  phoneNumber,
  jobTitle,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <div className="flex flex-col gap-2 p-6">
        <h1 className="text-xl">Profile</h1>
        <div className="flex flex-col">
          {/* TODO: Change Email */}
          <div
            className="border-t-2 border-t-black border-b-2 border-b-black pt-2 pb-2 flex cursor-pointer"
            onClick={onOpen}
          >
            E-mail
            <div className="ml-4 text-slate-600">{email}</div>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Change e-mail</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={2}>
                    <input
                      id="email"
                      type="text"
                      placeholder="E-mail"
                      className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
                      onInput={() => console.log('hello')}
                    />
                    <Divider borderColor="#000" borderWidth="1px" />
                    <input
                      id="email"
                      type="text"
                      placeholder="Enter password to confirm"
                      className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}
                      onInput={() => console.log('hello')}
                    />{' '}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="black"
                    mr={3}
                    onClick={onClose}
                    variant="outline"
                    fontWeight="medium"
                    borderWidth="2px"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    textColor="#00143173"
                    bg="#CED6DE"
                    fontWeight="medium"
                  >
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className="border-b-2 border-b-black pt-2 pb-2 flex">
            Name
            <div className="ml-4 text-slate-600">{fullName}</div>
          </div>
          <div className="border-b-2 border-b-black pt-2 pb-2 flex">
            Phone number
            <div className="ml-4 text-slate-600">{phoneNumber}</div>
          </div>
          <div className="border-b-2 border-b-black pt-2 pb-2 flex">
            Company
            <div className="ml-4 text-slate-600">{companyName}</div>
          </div>
          <div className="border-b-2 border-b-black pt-2 pb-2 flex">
            Job title
            <div className="ml-4 text-slate-600">{jobTitle}</div>
          </div>
        </div>
      </div>
      {/* <ThemePreferences /> */}
      {/*<div className="flex flex-col gap-2 p-6">*/}
      {/*  <h1 className="text-xl">Security</h1>*/}
      {/*  /!*@ts-ignore*!/*/}
      {/*  <Accordion allowMultiple p={0} className="border-b border-b-black">*/}
      {/*    <AccordionItem>*/}
      {/*      <h2>*/}
      {/*        /!* TODO: Change password *!/*/}
      {/*        <AccordionButton className="border-t-2 border-t-black">*/}
      {/*          <Box as="span" flex="1" textAlign="left">*/}
      {/*            Password*/}
      {/*          </Box>*/}
      {/*          <AccordionIcon />*/}
      {/*        </AccordionButton>*/}
      {/*      </h2>*/}
      {/*    </AccordionItem>*/}
      {/*  </Accordion>*/}
      {/*  /!* TODO: Add terminate all sessions*!/*/}
      {/*  <Button colorScheme="red" variant="outline" bgColor="#CB35351A">*/}
      {/*    Terminate all other sessions*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
};

export default Account;

Account.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
