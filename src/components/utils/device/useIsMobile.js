import { useMediaQuery } from '@chakra-ui/react';

function useIsMobile() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    return isMobile;
  }

export default useIsMobile;