import { Badge } from "@chakra-ui/react";

function StatusBadge(status) {
    if (status == 3) {
        // @ts-ignore
        return <Badge colorScheme="red">Terminated</Badge>;
      } else if (status == 2) {
        return <Badge colorScheme="green">Stored</Badge>;
      } else if (status == 1) {
        return <Badge colorScheme="blue">Data Prep</Badge>;
      } else {
        return <Badge>Upload Requested</Badge>;
      }
  }

  export default StatusBadge;