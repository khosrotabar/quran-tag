import { ocrBaseUrl } from "@/config";
import { getJsonOcr } from "@/services/api";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { TextBox } from "./TextBox";
import { Box, Pages, getPagesWithBoxes } from "@/util/text-boxe";

type DocumentProps = {
  page: number;
};

const Document: React.FC<DocumentProps> = ({ page }) => {
  const { data } = useQuery(["document-data", page], () => getJsonOcr(page));
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showText, setShowText] = useState(true);
  const pages: Pages = useMemo(() => getPagesWithBoxes(data?.pages!), [data]);

  useEffect(() => {
    setImageLoaded(false);
  }, [page]);

  return (
    <div className="relative h-[90%] w-[600px]">
      <img
        src={`${ocrBaseUrl}/ocr/${page}.jpg`}
        className={clsx(
          "absolute left-0 top-0 h-full w-full",
          imageLoaded ? "opacity-100" : "pointer-events-none opacity-30",
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
    </div>
  );
};

export default Document;
