import React from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import { useMediaQuery } from '@chakra-ui/media-query';

const UploadPortal: NextPageWithLayout = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  return (
    <AuthorizedRoute>
      <>
        <div className="h-screen flex justify-center items-center">
          {isMobile ? (
            <div className="text-xl font-medium mt-auto mb-auto">
              While Tombolo is in beta version, we will handle your uploads
              manually. Please fill in the{' '}
              <Link
                href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
                className="text-[#5299E0] underline underline-offset-4"
              >
                upload request form
              </Link>{' '}
              and we will get in touch shortly.
            </div>
          ) : (
            <div className="text-xl font-medium mt-auto mb-auto">
              While Tombolo is in beta version,
              <p className="break-after-colum">
                we will handle your uploads manually.
              </p>
              Please fill in the{' '}
              <Link
                href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
                className="text-[#5299E0] underline underline-offset-4"
              >
                upload request form
              </Link>{' '}
              and
              <p className="break-after-colum">we will get in touch shortly.</p>
            </div>
          )}
        </div>
      </>
    </AuthorizedRoute>
  );
};
export default UploadPortal;

UploadPortal.getLayout = (page) => <AuthedLayout>{page}</AuthedLayout>;
