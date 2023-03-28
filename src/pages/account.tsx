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
import { useAuth } from '@/contexts/auth';
import { auth, db } from '@/lib/firebase/client';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import { useEffect, useState } from 'react';
import { User } from '@/lib/entities/user';
import LoadingScreen from '@/components/utils/screens/LoadingScreen';

const Account: NextPageWithLayout = ({}) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (user) {
      db.getUser(user.uid).then((data) => {
        setUserData(data);
      });
    }
  }, [user]);

  if (!userData) {
    return <LoadingScreen />;
  }

  const handleNewEmail = () => {
    if (user) {
      auth
        .updateEmail(newEmail)
        .then(() => {
          console.log('Updated email in auth');
          db.updateUserEmail(user.uid, newEmail)
            .then(() => {
              console.log('Updated email in db');
              // Copy User Data
              const newUserData = { ...userData };
              // Update email
              newUserData.email = newEmail;
              // Set new user data
              setUserData(newUserData);
              onClose();
            })
            .catch((err) => {
              console.log(err);
              setError(err.message);
            });
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    }
  };

  return (
    <div>
      <AuthorizedRoute>
        <div className="flex flex-col gap-2 p-6">
          <h1 className="text-xl">Profile</h1>
          <div className="flex flex-col">
            {/* TODO: Change Email */}
            <div
              className="border-t-2 border-t-black border-b-2 border-b-black pt-2 pb-2 flex cursor-pointer"
              onClick={onOpen}
            >
              E-mail
              <div className="ml-4 text-slate-600">{userData.email}</div>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                {/*@ts-ignore*/}
                <ModalContent>
                  <ModalHeader>Change e-mail</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Stack spacing={2}>
                      <input
                        id="email"
                        type="text"
                        placeholder="New E-mail"
                        className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                        }}
                      />
                      {/*<Divider borderColor="#000" borderWidth="1px" />*/}
                      {/*<input*/}
                      {/*  id="email"*/}
                      {/*  type="text"*/}
                      {/*  placeholder="Enter password to confirm"*/}
                      {/*  className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}*/}
                      {/*/>{' '}*/}
                      {error && (
                        <div className="flex text-red-500">{error}</div>
                      )}
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="black"
                      mr={3}
                      onClick={() => {
                        onClose();
                        setError('');
                      }}
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
                      onClick={() => {
                        handleNewEmail();
                      }}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
            <div className="border-b-2 border-b-black pt-2 pb-2 flex">
              Name
              <div className="ml-4 text-slate-600">{userData.fullName}</div>
            </div>
            <div className="border-b-2 border-b-black pt-2 pb-2 flex">
              Phone number
              <div className="ml-4 text-slate-600">{userData.phoneNumber}</div>
            </div>
            <div className="border-b-2 border-b-black pt-2 pb-2 flex">
              Company
              <div className="ml-4 text-slate-600">{userData.companyName}</div>
            </div>
            <div className="border-b-2 border-b-black pt-2 pb-2 flex">
              Job title
              <div className="ml-4 text-slate-600">{userData.jobTitle}</div>
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
      </AuthorizedRoute>
    </div>
  );
};

export default Account;

Account.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
