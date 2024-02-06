import { FC, useLayoutEffect, useState } from "react";
import { Box } from "@/util/text-boxe";
import clsx from "clsx";
import { useElementSize } from "usehooks-ts";

type TextBoxProps = {
  boxData: Partial<Box>;
};

export const TextBox: FC<TextBoxProps> = ({ boxData }) => {
  const [boxRef, { width: boxW, height: boxH }] = useElementSize();
  const [textRef, { width: contentW, height: contentH }] = useElementSize();
  const [contentScale, setContentScale] = useState({ scaleX: 1, scaleY: 1 });

  useLayoutEffect(() => {
    if (![boxW, boxH, contentW, contentH].includes(0)) {
      const scaleX = boxW / contentW;
      const scaleY = boxH / contentH;
      setContentScale({ scaleX, scaleY });
    }
  }, [boxW, boxH, contentW, contentH]);

  return (
    <div
      ref={boxRef}
      className={clsx(
        "absolute",
        boxData?.type === "text"
          ? "bg-[#f4b387] bg-opacity-70"
          : "bg-primary/50",
      )}
      style={{
        left: `${boxData?.relativeBoxLeft}%`,
        top: `${boxData?.relativeBoxTop}%`,
        width: `${boxData?.relativeBoxWidth}%`,
        height: `${boxData?.relativeBoxHeight}%`,
        direction: boxData?.direction,
      }}
    >
      <span
        ref={textRef}
        className={clsx(
          "inline-block whitespace-pre",
          boxData?.direction === "rtl" ? "origin-top-right" : "origin-top-left",
        )}
        style={{
          transform: `scale(${contentScale.scaleX}, ${contentScale.scaleY})`,
        }}
      >
        {boxData?.boxText}
      </span>
    </div>
  );
};
