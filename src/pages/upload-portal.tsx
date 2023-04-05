import React from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/pages/page';
import AuthedLayout from '@/components/layouts/authed/AuthedLayout';
import AuthorizedRoute from '@/components/utils/routes/Authorized';
import BrandLogo from '@/images/icons/BrandLogo';
import BrandWordmark from '@/images/icons/BrandWordmark';
import Hamburger from '@/images/icons/Hamburger';
import AlphaTag from '@/images/tags/AlphaTag';

const UploadPortal: NextPageWithLayout = () => {
  return (
    <AuthorizedRoute>
      <div className="xs:hidden lg:block">
        <div className="h-screen flex justify-center content-center">
          <div className="text-xl font-medium mt-auto mb-auto">
            While Tombolo is in beta version,
            <p className="break-after-colum">
              we will handle your uploads manually.
            </p>
            Please fill in the
            <Link
              href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
              className="text-[#5299E0] underline underline-offset-4"
            >
              {' '}
              upload request form
            </Link>{' '}
            and
            <p className="break-after-colum">we will get in touch shortly.</p>
          </div>
        </div>
      </div>
      <div className="xs:block lg:hidden">
        <div className="flex items-center cursor-pointer gap-1 pl-2 border-b border-b-2 border-b-black">
          <BrandLogo />
          <BrandWordmark />
          <AlphaTag />
          <label
            htmlFor="sidebar-nav"
            className="drawer-button cursor-pointer -translate-x-2 ml-auto"
          >
            <Hamburger />
          </label>
        </div>
        <div className="h-screen flex justify-center content-center">
          <div className="text-xl font-medium mt-auto mb-auto">
            While Tombolo is in beta version,
            <p className="break-after-colum">
              we will handle your uploads manually.
            </p>
            Please fill in the
            <Link
              href={'https://share.hsforms.com/1mvZF3awnRJC6ywL2aC8-tQe3p87'}
              className="text-[#5299E0] underline underline-offset-4"
            >
              {' '}
              upload request form
            </Link>{' '}
            and
            <p className="break-after-colum">we will get in touch shortly.</p>
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
};
export default UploadPortal;

UploadPortal.getLayout = (page) => <AuthedLayout>{page}</AuthedLayout>;
