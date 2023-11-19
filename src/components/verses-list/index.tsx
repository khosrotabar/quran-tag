import React from "react";
import { v4 as uuidv4 } from "uuid";
import { quran_data } from "@/data";
import { convertToFarsiDigits } from "@/util";
import VerseItem from "./VerseItem";
import Header from "../header";
import IslamicBanner from "@/assets/images/vecteezy_islamic-banner.png";

type VrsesListProps = {
  page: number;
};

const VrsesList: React.FC<VrsesListProps> = ({ page }) => {
  const data = quran_data[quran_data.length - 1].data;
  const lastPage = data[data.length - 1].page;

  const generateArrayFromString = (str: string) => {
    const words = str.split(" ");

    const mappedArray = words.map((word) => {
      return {
        text: word,
        id: uuidv4(),
      };
    });

    return mappedArray;
  };

  return (
    <div className="mx-auto flex h-screen w-[600px] items-center justify-center font-quranfont">
      <div className="h-[90%] overflow-y-auto rounded-[10px] bg-orange-50 px-[16px] py-[10px] shadow-md">
        <Header page={page} lastPage={lastPage} />
        {quran_data.map((verse, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-[16px]"
          >
            {verse.title.page === page && (
              <div className="relative mt-3 flex w-full flex-col flex-wrap items-center gap-9">
                <img
                  src={IslamicBanner}
                  alt=""
                  className="absolute -bottom-[5px] h-[170px] w-[350px] object-cover"
                />
                <div className="z-10 mt-4 text-center text-[22px] font-bold">
                  سوره {verse.title.text}
                </div>
                <div className="text-center text-[20px] font-normal">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>
            )}
            <div className="z-10 flex flex-wrap items-center justify-start gap-[10px] whitespace-pre-wrap text-[18px] font-normal">
              {verse.data
                .filter((item) => item.page === page)
                .map((item, innerIndex) => (
                  <>
                    {generateArrayFromString(item.text).map((word) => (
                      <VerseItem word={word} />
                    ))}
                    <div
                      key={`${innerIndex}_${item.id}`}
                      className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#cdb380] pt-[3px] font-rranyekan text-sm font-normal text-white"
                    >
                      {convertToFarsiDigits(item.id.split("_")[1])}
                    </div>
                  </>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VrsesList;
