import { DeleteIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import router from 'next/router';
import React from 'react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
export interface Card {
  name: string;
  size: number;
  onClick?: () => void;
  id: string;
  isFiles?: boolean;
  onClickFileView?: () => void;
  onClickDelete?: () => void;
  stat?: any;
}

const CardMobile: React.FC<Card> = ({
  name,
  size,
  onClick,
  id,
  isFiles = true,
  onClickFileView,
  onClickDelete,
  stat,
}) => {
  return isFiles ? (
    <>
      <div className="bg-white mt-4">
        <div className="flex border-b">
          <div className="p-3 text-lg border-r grow truncate">
            {name}
            <div className="text-xs text-slate-400">{size}</div>
          </div>
          <Menu>
            <MenuButton
              as={IconButton}
              className="m-auto mx-4"
              aria-label="Options"
              icon={<BsThreeDots />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<AiOutlineFolderOpen />} onClick={onClick}>
                File Retrieval Request
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="text-xs text-slate-400 p-3">
          Upload ID
          <div className="text-black truncate"> {id}</div>
        </div>
      </div>
    </>
  ) : (
    <div className="bg-white mt-4">
      <div className="flex border-b">
        <div className="p-3 text-lg border-r grow truncate">
          {name}
          <div className="text-xs text-slate-400">{size}</div>
        </div>
        <Menu>
          <MenuButton
            as={IconButton}
            className="m-auto mx-4"
            aria-label="Options"
            icon={<BsThreeDots />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<AiOutlineFolderOpen />} onClick={onClickFileView}>
              Open File View
            </MenuItem>
            <MenuItem icon={<DeleteIcon />} onClick={onClickDelete}>
              Request Termination
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="border-b text-center text-xs text-slate-400">{stat}</div>
      <div className="text-xs text-slate-400 p-3">
        Upload ID
        <div className="text-black truncate"> {id}</div>
      </div>
    </div>
  );
};

export default CardMobile;
