import React, { useEffect, useMemo, useRef, useState } from "react";

import { quran_data } from "@/data";
import Header from "../header";
import IslamicBanner from "@/assets/images/vecteezy_islamic-banner.webp";
import { getPage, pageOuput } from "@/services/api";
import Verse from "./Verse";
import { VrsesListProps } from "@/shared";
// import CopyBoard from "./CopyBoard";

const VrsesList: React.FC<VrsesListProps> = ({ page }) => {
  const [quranResponse, setQuranResponse] = useState<pageOuput[][]>([]);
  const data = quran_data[quran_data.length - 1].data;
  const lastPage = data[data.length - 1].page;
  const parentRef = useRef<HTMLDivElement | null>(null);

  const quranDataFiltered = useMemo(() => {
    return quran_data
      .map((sura) => ({
        ...sura,
        data: sura.data.filter((verse) => verse.page === page),
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
    <div
      className="flex h-full w-[600px] items-center justify-center font-quranfont"
      ref={parentRef}
    >
      <div className="relative h-[90%] w-full bg-orange-50 px-[16px] py-[10px] pb-[60px] shadow-md">
        <Header page={page} lastPage={lastPage} />
        <div className="h-[94%] overflow-y-auto overflow-x-hidden">
          {quranDataFiltered.map((sura, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-[16px]"
            >
              {sura.title.page === page && (
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
              <div className="z-10 flex flex-wrap items-center justify-start gap-[10px] whitespace-pre-wrap text-[24px] font-normal">
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
                      parentRef={parentRef}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* <CopyBoard versId={quranDataFiltered[0].data[0].id} /> */}
      </div>
    </div>
  );
};

export default VrsesList;
