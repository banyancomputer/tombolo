import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { HStack } from '@chakra-ui/react';
import React from 'react';
import { SiTwitter, SiDiscord } from 'react-icons/si';
import Link from 'next/link';

const NoUploadScreen = () => {
  return (
    <>
      <div className="h-screen flex justify-center content-center">
        <div className="text-xl font-medium mt-auto mb-auto">
          You don&apos;t have any uploads yet.
          <p className="break-after-colum"></p>
          <Link
            href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
            className="text-[#5299E0] underline underline-offset-4"
          >
            Request
          </Link>{' '}
          your first upload or learn more
          <div className="flex">
            about
            <Link
              href="https://www.tombolo.store/"
              className="text-[#5299E0] underline underline-offset-4 ml-2"
            >
              Tombolo
            </Link>
            {/*@ts-ignore*/}
            <HStack spacing={2} direction="row">
              <ArrowForwardIcon />
              <Icon
                className="cursor-pointer"
                w={30}
                h={30}
                as={SiTwitter}
                onClick={() =>
                  window.open('https://twitter.com/tombolostorage', '_blank')
                }
              />
              <Icon
                className="cursor-pointer"
                w={30}
                h={30}
                as={SiDiscord}
                onClick={() =>
                  window.open('https://discord.com/invite/RdqBjFjUpk', '_blank')
                }
              />
            </HStack>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoUploadScreen;
