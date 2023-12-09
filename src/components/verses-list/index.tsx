import React, { useEffect, useMemo, useState } from "react";
import { quran_data } from "@/data";
import Header from "../header";
import IslamicBanner from "@/assets/images/vecteezy_islamic-banner.webp";
import { getPage, pageOuput } from "@/api";
import Verse from "./Verse";
import { VrsesListProps } from "@/shared";

const VrsesList: React.FC<VrsesListProps> = ({ page }) => {
  const [quranResponse, setQuranResponse] = useState<pageOuput[][]>([]);
  const data = quran_data[quran_data.length - 1].data;
  const lastPage = data[data.length - 1].page;

  const quranDataFiltered = useMemo(() => {
    return quran_data
      .map((sura) => ({
        ...sura,
        data: sura.data.filter((verse) => verse.currentPage === page),
      }))
      .filter((sura) => sura.data.length > 0);
  }, [quran_data, page]);

  useEffect(() => {
    const getPageFunc = async () => {
      let response: pageOuput[][] = [];

      for (const suraData of quranDataFiltered) {
        for (const verseData of suraData.data) {
          const data = await getPage(verseData.page, verseData.id);

          if (data) {
            data.forEach((wordData) => {
              wordData.id = verseData.id;
            });
            response.push(data);
          }
        }
      }
      setQuranResponse(response);
    };

    getPageFunc();
  }, [quranDataFiltered, page]);

  return (
    <div className="mx-auto flex h-screen w-[600px] items-center justify-center font-quranfont">
      <div className="h-[80%] w-full overflow-y-auto rounded-[10px] bg-orange-50 px-[16px] py-[10px] shadow-md">
        <Header page={page} lastPage={lastPage} />
        {quranDataFiltered.map((sura, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-[16px]"
          >
            {sura.title.currentPage === page && (
              <div className="relative mt-3 flex w-full flex-col flex-wrap items-center gap-9">
                <img
                  src={IslamicBanner}
                  alt=""
                  className="absolute -bottom-[5px] h-[170px] w-[350px] object-cover"
                />
                <div className="z-10 mt-4 text-center text-[22px] font-bold">
                  سوره {sura.title.text}
                </div>
                <div className="text-center text-[20px] font-normal">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>
            )}
            <div className="z-10 flex flex-wrap items-center justify-start gap-[10px] whitespace-pre-wrap text-[18px] font-normal">
              {sura.data.map((verse, innerIndex) => {
                const response = quranResponse.find((item) =>
                  item.some((el) => el.id === verse.id),
                );

                return (
                  <Verse
                    key={innerIndex}
                    verse={verse}
                    quranResponse={response || []}
                    innerIndex={innerIndex}
                    page={page}
                    pageToSubmit={verse.page}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VrsesList;
