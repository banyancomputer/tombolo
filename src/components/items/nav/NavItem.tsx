import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
export interface INavItem {
  item: any;
  key: any;
  handleCloseDrawer: () => void;
}

const NavItem: React.FC<INavItem> = ({ item, handleCloseDrawer }) => {
  const location = useRouter();

  return (
    <>
      <li>
        {item.callback ? (
          <button
            className={`flex gap-2 font-semibold text-lg ${
              location.pathname === item.href
                ? '!text-base-100 !bg-base-content'
                : ''
            }`}
            onClick={() => {
              item.callback();
            }}
          >
            {React.createElement(item.icon)}
            {item.label}
          </button>
        ) : (
          <Link
            className={`flex items-center justify-start gap-2 font-medium text-lg text-base-content hover:text-[#5299E0] focus:text-[#5299E0] active:text-[#5299E0] bg-base-100 ${
              location.pathname === item.href ? '!text-[#5299E0]' : ''
            }`}
            href={item.href}
            onClick={() => {
              handleCloseDrawer();
            }}
          >
            {React.createElement(item.icon)}
            {item.label}
          </Link>
        )}
      </li>
    </>
  );
};

export default NavItem;
