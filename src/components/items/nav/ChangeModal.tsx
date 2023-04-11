import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalFooter,
  Button,
  ModalContent,
} from '@chakra-ui/react';
export interface INavItem {
  isOpen: boolean;
  onClose: () => void;
  changeName: string;
  onChangeValue: any;
  changeInputId: string;
  changeInputPlaceholder: string;
  error: string;
  onClickCancel: () => void;
  onClickSave: () => void;
}

const ChangeModal: React.FC<INavItem> = ({
  isOpen,
  onClose,
  changeName,
  onChangeValue,
  changeInputId,
  changeInputPlaceholder,
  error,
  onClickCancel,
  onClickSave,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {/*@ts-ignore*/}
      <ModalContent>
        <ModalHeader>{changeName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2}>
            <input
              id={changeInputId}
              type="text"
              placeholder={changeInputPlaceholder}
              className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3`}
              onChange={onChangeValue}
            />
            {/*<Divider borderColor="#000" borderWidth="1px" />*/}
            {/*<input*/}
            {/*  id="email"*/}
            {/*  type="text"*/}
            {/*  placeholder="Enter password to confirm"*/}
            {/*  className={`input border-[#E9E9EA] border-2 rounded-sm focus:outline-none w-full px-3 mb-3`}*/}
            {/*/>{' '}*/}
            {error && <div className="flex text-red-500">{error}</div>}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="black"
            mr={3}
            onClick={onClickCancel}
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
            onClick={onClickSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeModal;
