import React from "react";
import { quran_data } from "@/data";
import { convertToFarsiDigits } from "@/util";

type VrsesListProps = {
  page: number;
};

const VrsesList: React.FC<VrsesListProps> = ({ page }) => {
  return (
    <div className="mx-auto flex w-[600px] flex-wrap items-center justify-start gap-[10px] pt-[70px] font-quranfont text-[20px] font-normal">
      {quran_data.map((verse, index) => {
        return (
          verse.page === page && (
            <div key={index} className="flex w-fit items-center gap-[10px]">
              <div>{verse.text}</div>
              <div className="font-rranyekan flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#cdb380] pt-[3px] text-sm font-normal text-white">
                {convertToFarsiDigits(verse.id.split("_")[1])}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default VrsesList;
