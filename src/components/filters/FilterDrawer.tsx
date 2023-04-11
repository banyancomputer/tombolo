import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  DrawerFooter,
  Button,
  Box,
} from '@chakra-ui/react';

export interface IFilter {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  firstFilterName: string;
  clearAll: () => void;
}
// @ts-ignore
const FilterDrawer: React.FC<IFilter> = ({
  children,
  onClose,
  isOpen,
  firstFilterName,
  clearAll,
}) => {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay bgColor="#16181BE5" />
      <DrawerContent>
        <h1 className="text-xl mt-12 mb-2 ml-2 font-medium">Filters</h1>
        <DrawerBody p={0}>
          <Accordion allowMultiple className="border-b border-b-black">
            <AccordionItem>
              <h2>
                <AccordionButton className="border-t-2 border-t-black pt-4 pb-4">
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    className="font-bold mb-2 text-xs mt-2"
                  >
                    {firstFilterName}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{children}</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </DrawerBody>
        <DrawerFooter
          borderTopWidth="2px"
          borderTopColor="black"
          className="mt-12"
        >
          <Button
            colorScheme="black"
            variant="outline"
            mr="auto"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
