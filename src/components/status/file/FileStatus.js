import { ArrowForwardIcon } from '@chakra-ui/icons';

function FileStatus(status) {
    if (status == 3) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> Stored <ArrowForwardIcon />
            <div className="font-bold"> Terminated </div>
          </div>
        );
      } else if (status == 2) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> <div className="font-bold"> Stored </div>
            <ArrowForwardIcon /> Terminated
          </div>
        );
      } else if (status == 1) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon />
            <div className="font-bold">Data Prep </div>
            <ArrowForwardIcon /> Stored <ArrowForwardIcon /> Terminated
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center">
            <div className="font-bold">Requested</div>
            <ArrowForwardIcon /> Data Prep <ArrowForwardIcon /> Stored
            <ArrowForwardIcon /> Terminated
          </div>
        );
      }
  }

  export default FileStatus;