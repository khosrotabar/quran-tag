import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { quran_data } from "@/data";
import { convertToFarsiDigits, generateArrayFromString } from "@/util";
import VerseItem from "./VerseItem";
import Header from "../header";
import IslamicBanner from "@/assets/images/vecteezy_islamic-banner.webp";
import clsx from "clsx";
import { getPage, pageOuput } from "@/api";

type VrsesListProps = {
  page: number;
  isLoading: boolean;
  lastEditId: string | undefined;
};

const VrsesList: React.FC<VrsesListProps> = ({
  page,
  isLoading,
  lastEditId,
}) => {
  const [quranResponse, setQuranResponse] = useState<pageOuput[][]>([]);
  const data = quran_data[quran_data.length - 1].data;
  const lastPage = data[data.length - 1].page;

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
          const data = await getPage(page, verseData.id);

          if (data) {
            data.forEach((wordData) => {
              const wordDataArray = wordData.word.split(" ");
              const wordPositionArray = wordData.position.split(", ");
              const verseDataArray = verseData.raw.split(" ");
              for (var i = 0; i < wordDataArray.length; i++) {
                const wordCorrectIndex = verseDataArray.findIndex(
                  (item) =>
                    item === wordDataArray[i] ||
                    wordDataArray[i].includes(item) ||
                    item.includes(wordDataArray[i]),
                );
                const wordCorrectIndexString = (
                  wordCorrectIndex + 1
                ).toString();
                if (
                  wordPositionArray[i] !== wordCorrectIndexString &&
                  wordCorrectIndex >= 0
                ) {
                  wordPositionArray[i] = wordCorrectIndexString;
                }
              }
              wordData.position = wordPositionArray.join(", ");
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

  const getQuranResponseObject = (word: string, wordId: string) => {
    if (quranResponse.length !== 0) {
      const filteredArray = quranResponse.find((response) =>
        response.some((item) => item.id === wordId),
      );

      if (filteredArray) {
        const foundItem = filteredArray.find(
          (item) => item.word.includes(word) || word.includes(item.word),
        );
        console.log(foundItem);
        console.log(filteredArray);
        return foundItem;
      }
    }
    return undefined;
  };

  console.log(quranResponse);

  return (
    <div className="mx-auto flex h-screen w-[600px] items-center justify-center font-quranfont">
      <div className="h-[90%] w-full overflow-y-auto rounded-[10px] bg-orange-50 px-[16px] py-[10px] shadow-md">
        <Header page={page} lastPage={lastPage} isLoading={isLoading} />
        {!isLoading ? (
          quranDataFiltered.map((sura, index) => (
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
              <div className="z-10 flex flex-wrap items-center justify-start gap-[10px] whitespace-pre-wrap text-[18px] font-normal">
                {sura.data.map((verse, innerIndex) => (
                  <Fragment key={innerIndex}>
                    {generateArrayFromString(
                      verse.text,
                      verse.id,
                      verse.raw,
                    ).map((word, index) => {
                      const responseObject = getQuranResponseObject(
                        word.raw,
                        word.id,
                      );
                      // const responseObject = undefined;
                      return (
                        <div key={verse.text + verse.id + index}>
                          <VerseItem
                            word={word}
                            responseObject={responseObject}
                          />
                        </div>
                      );
                    })}
                    <div
                      className={clsx(
                        "flex h-[23px] w-[23px] items-center justify-center rounded-full pt-[3px] font-rranyekan text-sm font-normal text-white",
                        lastEditId && lastEditId === verse.id
                          ? "bg-[#66593f]"
                          : "bg-[#cdb380]",
                      )}
                    >
                      {convertToFarsiDigits(verse.id.split("_")[1])}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 m-auto h-fit w-fit">
            <ScaleLoader color="#003648" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VrsesList;
