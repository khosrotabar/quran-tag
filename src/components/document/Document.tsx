import { ocrBaseUrl } from "@/config";
import { getJsonOcr } from "@/services/api";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { TextBox } from "./TextBox";
import { Pages, getPagesWithBoxes } from "@/util/text-boxe";
import RotateIcon from "../icons/RotateIcon";

type DocumentProps = {
  page: number;
};

const Document: React.FC<DocumentProps> = ({ page }) => {
  const { data } = useQuery(["document-data", page], () => getJsonOcr(page));
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showText, setShowText] = useState(true);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const pages: Pages = useMemo(() => getPagesWithBoxes(data?.pages!), [data]);

  useEffect(() => {
    setImageLoaded(false);
    setShowText(true);
  }, [page]);

  return (
    <div
      className="relative flex h-[90%] w-[600px] flex-col items-center shadow-md"
      onMouseOver={() => setShowBtn(true)}
      onMouseLeave={() => setShowBtn(false)}
    >
      <img
        src={`${ocrBaseUrl}/ocr/${page}.jpg`}
        className={clsx(
          "absolute left-0 top-0 h-full w-full",
          imageLoaded ? "opacity-100" : "opacity-30",
        )}
        alt="image"
        onLoad={() => setImageLoaded(true)}
      />
      <div
        className={clsx(
          showText ? "z-50 opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {pages &&
          pages[0].map((boxData, index: number) => {
            return <TextBox key={index} boxData={boxData} />;
          })}
      </div>
      <button
        className={clsx(
          "absolute bottom-4 z-50 flex items-center justify-center gap-2 rounded-full border-[1px] px-3 py-1 text-base shadow-sm transition-all duration-200",
          showText
            ? "border-[#1C1B2D] bg-white text-[#1C1B2D]"
            : "border-[#ED8138] bg-[#ED8138] text-white",
          showBtn ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setShowText(!showText)}
      >
        <RotateIcon
          width={12}
          height={13}
          color={showText ? "#1C1B2D" : "#FFFFFF"}
        />
        <span>نمایش تصویر اصلی</span>
      </button>
    </div>
  );
};

export default Document;
