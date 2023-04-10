import React, { useState } from 'react';

import AlphaTag from '../../../images/tags/AlphaTag';
import BrandLogo from '@/images/icons/BrandLogo';
import BrandWordmark from '@/images/icons/BrandWordmark';
import Hamburger from '@/images/icons/Hamburger';

export interface ISideNav {}
// @ts-ignore
const NavMobile: React.FC<ISideNav> = ({ children }) => {
  return (
    <div className="flex-col">
      <div className="flex items-center cursor-pointer gap-1 pl-2 border-b border-b-2 border-b-black pt-4 pb-4">
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
      {children}
    </div>
  );
};

export default NavMobile;
