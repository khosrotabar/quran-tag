import React, { Fragment, useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import clsx from "clsx";
import { convertToFarsiDigits, generateArrayFromString } from "@/util";
import VerseItem from "./VerseItem";
import { pageOuput } from "@/api";
import { activeVerseProps, verseProps } from "@/shared";

type VerseProps = {
  innerIndex: number;
  verse: verseProps;
  quranResponse: pageOuput[];
  lastEditId: string | undefined;
};

const Verse: React.FC<VerseProps> = ({
  innerIndex,
  verse,
  quranResponse,
  lastEditId,
}) => {
  let currentArray: pageOuput[] = [...quranResponse];
  const [quranResponseCopy, setQuranResponseCopy] = useState<pageOuput[]>([]);
  const [activeVerse, setActiveVerse] = useState<activeVerseProps[]>([]);
  const [reservedArray, setReservedArray] = useState<pageOuput[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [isArrayChanged, setIsArrayChanged] = useState<boolean>(false);
  const bgColor =
    lastEditId && lastEditId === verse.id && !isArrayChanged
      ? "bg-[#66593f]"
      : !lastEditId || lastEditId !== verse.id
        ? "bg-[#cdb380]"
        : isArrayChanged
          ? "bg-lime-600"
          : "";

  useEffect(() => {
    if (reservedArray.length === 0) {
      setActiveVerse([]);
    }

    if (!reservedArray.some((item) => item.meaning !== "")) {
      setTagInput("");
    }
  }, [reservedArray]);

  useEffect(() => {
    setQuranResponseCopy([...quranResponse]);
  }, [quranResponse]);

  useEffect(() => {
    if (quranResponseCopy.length !== 0) {
      if (
        currentArray.length !== quranResponseCopy.length ||
        !currentArray.every(
          (value, index) => value === quranResponseCopy[index],
        )
      ) {
        console.log("Array has changed!");
        setIsArrayChanged(true);
      } else {
        setIsArrayChanged(false);
      }
    }
  }, [quranResponseCopy]);

  return (
    <Fragment key={innerIndex + 1}>
      {generateArrayFromString(
        verse.text,
        verse.id,
        verse.raw,
        quranResponseCopy,
      ).map((word, index) => {
        return (
          <div key={verse.text + verse.id + index}>
            <VerseItem
              index={index}
              word={word}
              activeVerse={activeVerse}
              meaning={word.meaning}
              reservedArray={reservedArray}
              quranResponseCopy={quranResponseCopy}
              tagInput={tagInput}
              setQuranResponseCopy={setQuranResponseCopy}
              setActiveVerse={setActiveVerse}
              setReservedArray={setReservedArray}
              setTagInput={setTagInput}
            />
          </div>
        );
      })}
      <div
        className={clsx(
          "flex h-[23px] w-[23px] items-center justify-center rounded-full pt-[3px] font-rranyekan text-sm font-normal text-white",
          bgColor,
        )}
      >
        {isArrayChanged ? (
          <IconContext.Provider
            value={{ size: "22", className: "-mt-[3px] cursor-pointer" }}
          >
            <TiTick />
          </IconContext.Provider>
        ) : (
          convertToFarsiDigits(verse.id.split("_")[1])
        )}
      </div>
    </Fragment>
  );
};

export default Verse;
