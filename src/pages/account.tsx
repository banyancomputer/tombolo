import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Button,
} from '@chakra-ui/react';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import { useAuth } from '@/contexts/auth';
import { db } from '@/lib/firebase/client';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import { useEffect, useState } from 'react';
import { User } from '@/lib/entities/user';
import LoadingScreen from '@/components/utils/screens/LoadingScreen';

const Account: NextPageWithLayout = ({}) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

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

  // @ts-ignore
  return (
    <div>
      <AuthorizedRoute>
        <div className="flex flex-col gap-2 p-6">
          <h1 className="text-xl">Profile</h1>
          <div className="flex flex-col">
            {/* TODO: Change Email */}
            <div className="border-t-2 border-t-black border-b-2 border-b-black pt-2 pb-2 flex">
              E-mail
              {/*@ts-ignore*/}
              <div className="ml-4 text-slate-600">{userData.email}</div>
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
      </AuthorizedRoute>
    </div>
  );
};

export default Account;

Account.getLayout = (page) => {
  return <AuthedLayout>{page}</AuthedLayout>;
};
