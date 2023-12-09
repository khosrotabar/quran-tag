import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ScaleLoader } from "react-spinners";
import CopyToClipboard from "react-copy-to-clipboard";
import { getCopyBoard } from "@/api";
import { notify } from "@/util";

type CopyBoardProps = {
  versId: string;
};

const CopyBoard: React.FC<CopyBoardProps> = ({ versId }) => {
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({});
  const [wordsArray, setWordsArray] = useState<{ [key: string]: string }[]>([]);
  const { data, error, isLoading } = useQuery(["verseCopyWords", versId], () =>
    getCopyBoard(versId),
  );

  useEffect(() => {
    if (data) {
      const dataArray = Object.entries(data).map(([key, value]) => ({
        [key]: value,
      }));

      setWordsArray(dataArray);
    }
  }, [data]);

  const handleCopy = (index: number) => {
    setCopied({ [index]: true });
    setTimeout(() => {
      setCopied({ [index]: false });
    }, 4000); // 4 seconds in milliseconds
  };

  if (error) {
    notify("!مشکلی در گرفتن کلمات جهت کپی بوحود آمده است", "error");
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute bottom-0 flex h-[300px] w-full items-center justify-center">
        <ScaleLoader color="#003648" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      className="lex max-h-[400px] flex-col items-start overflow-y-auto px-[20px]"
      dir="rtl"
    >
      {wordsArray.map((word, index) => {
        return (
          <div
            key={index}
            className="flex w-full items-center justify-center border-b-[1px] border-b-[gray] border-opacity-40 py-4 text-[#303030] last:border-none"
          >
            <div className="flex w-[40%] justify-center text-[18px] font-[600]">
              {Object.keys(word)[0]}
            </div>
            <div className="relative flex w-[60%] cursor-pointer justify-center font-iranyekan text-[18px]">
              <CopyToClipboard
                text={Object.values(word)[0]}
                onCopy={() => handleCopy(index)}
              >
                <span>{Object.values(word)[0]}</span>
              </CopyToClipboard>
              {copied[index] && (
                <span
                  dir="ltr"
                  className="absolute left-0 top-0 rounded-[5px] bg-[#303030] bg-opacity-60 px-2 pb-1 pt-2 text-sm text-white"
                >
                  {" "}
                  Copied!
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CopyBoard;
