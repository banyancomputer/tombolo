import React from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import useIsMobile from '@/components/utils/device/useIsMobile';

const UploadPortal: NextPageWithLayout = () => {
  const [isMobile] = useIsMobile();
  const message =
    'While Tombolo is in beta version, we will handle your uploads manually. Please fill in the upload request form and we will get in touch shortly.';

  return (
    <AuthorizedRoute>
      <>
        <div className="h-screen flex justify-center items-center">
          <div className="text-xl font-medium mt-auto mb-auto">
            {isMobile ? (
              <>
                While Tombolo is in beta version, we will handle your uploads
                manually. Please fill in the{' '}
              </>
            ) : (
              <>
                While Tombolo is in beta version,
                <p className="break-after-colum">
                  we will handle your uploads manually.
                </p>
                Please fill in the{' '}
              </>
            )}
            <Link
              href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
              className="text-[#5299E0] underline underline-offset-4"
            >
              upload request form
            </Link>{' '}
            {isMobile ? (
              <>and we will get in touch shortly.</>
            ) : (
              <>
                and
                <p className="break-after-colum">
                  we will get in touch shortly.
                </p>
              </>
            )}
          </div>
        </div>
      </>
    </AuthorizedRoute>
  );
};
export default UploadPortal;

UploadPortal.getLayout = (page) => <AuthedLayout>{page}</AuthedLayout>;
