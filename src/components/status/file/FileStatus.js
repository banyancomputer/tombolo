import { ArrowForwardIcon } from '@chakra-ui/icons';

function FileStatus(status) {
    if (status == 3) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> Stored <ArrowForwardIcon />
            <div className="font-bold text-black"> Terminated </div>
          </div>
        );
      } else if (status == 2) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon /> Data Prep
            <ArrowForwardIcon /> <div className="font-bold text-black"> Stored </div>
            <ArrowForwardIcon /> Terminated
          </div>
        );
      } else if (status == 1) {
        return (
          <div className="flex items-center justify-center">
            Requested <ArrowForwardIcon />
            <div className="font-bold text-black">Data Prep </div>
            <ArrowForwardIcon /> Stored <ArrowForwardIcon /> Terminated
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center">
            <div className="font-bold text-black">Requested</div>
            <ArrowForwardIcon /> Data Prep <ArrowForwardIcon /> Stored
            <ArrowForwardIcon /> Terminated
          </div>
        );
      }
  }

  export default FileStatus;