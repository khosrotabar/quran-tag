import React, { useEffect } from "react";
import { quran_data, quran_suras } from "@/data";
import { convertToFarsiDigits } from "@/util";

type VrsesListProps = {
  page: number;
};

type neArrayProps = {
  page: number;
  title: string;
  data: {
    text: string;
    raw: string;
    id: string;
  }[];
};

const VrsesList: React.FC<VrsesListProps> = ({ page }) => {
  let new_array: neArrayProps[] = [];

  outerLoop: for (var i = 0; i < quran_suras.length; i++) {
    let page = 0;
    let title = "";
    let data = [];
    title = quran_suras[i];
    for (var j = 0; j < quran_data.length; j++) {
      if (
        quran_data[j - 1]?.id.split("_")[0] !== quran_data[j]?.id.split("_")[0]
      ) {
        page = parseInt(quran_data[j - 1]?.id.split("_")[0]);
        break outerLoop;
      }
      var text = quran_data[j].text;
      var raw = quran_data[j].raw;
      var id = quran_data[j].id;
      data.push({
        text: text,
        raw: raw,
        id: id,
      });
    }
    new_array.push({
      page: page,
      title: title,
      data: data,
    });
  }

  useEffect(() => {
    console.log(new_array);
  }, [new_array]);

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
