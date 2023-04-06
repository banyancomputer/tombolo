import React from 'react';
export interface DealCardMobile {
  firstBox: string;
  firstStat: number;
  secondBox: string;
  secondStat: number;
  isDesktop?: boolean;
}

const DealCardMobile: React.FC<DealCardMobile> = ({
  firstBox,
  firstStat,
  secondBox,
  secondStat,
  isDesktop = true,
}) => {
  return isDesktop ? (
    <div className="relative flex h-36">
      <div className="w-full p-4">
        {firstBox}
        <div className="absolute bottom-0 text-black font-medium text-xl mb-2 ">
          {/* Round TiBs to the nearst .01 Tib*/}
          {firstStat} TiB
        </div>
      </div>
      <div className="w-full border-l-2 border-l-[#000] p-4">
        {secondBox}
        <div className="absolute bottom-0 font-medium text-xl mb-2">
          {secondStat}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-row gap-2 pt-2 relative">
      <div className="bg-white p-3 w-full font-medium">
        <div className="text-slate-400"> {firstBox}</div>
        <div className="text-xl mt-2">{firstStat} TiB</div>
      </div>
      <div className="bg-white p-3 w-full font-medium">
        <div className="text-slate-400">{secondBox}</div>
        <div className="text-xl mt-2">{secondStat}</div>
      </div>
    </div>
  );
};

export default DealCardMobile;
