import React, { Fragment, useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import { ClockLoader } from "react-spinners";
import clsx from "clsx";
import { toast } from "react-toastify";
import { convertToFarsiDigits, generateArrayFromString, notify } from "@/util";
import VerseItem from "./VerseItem";
import { pageOuput, submitTags } from "@/api";
import { VerseProps, activeVerseProps } from "@/shared";

const Verse: React.FC<VerseProps> = ({
  innerIndex,
  verse,
  quranResponse,
  page,
  pageToSubmit,
}) => {
  let currentArray: pageOuput[] = [...quranResponse];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quranResponseCopy, setQuranResponseCopy] = useState<pageOuput[]>([]);
  const [activeVerse, setActiveVerse] = useState<activeVerseProps[]>([]);
  const [reservedArray, setReservedArray] = useState<pageOuput[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [isArrayChanged, setIsArrayChanged] = useState<boolean>(false);

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

  const submitHandler = async () => {
    setIsArrayChanged(false);
    setIsLoading(true);
    const newArray = quranResponseCopy.map(({ id, ...rest }) => rest);
    const data = await submitTags(newArray, pageToSubmit, verse.id);
    if (!data) {
      notify("!مشکلی در سرور بوجود آمده است", "error");
    }
    localStorage.setItem("lastPageEdited", page.toString());
    setIsLoading(false);
  };

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
            {word && (
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
            )}
          </div>
        );
      })}
      <div
        className={clsx(
          "font-iranyekan flex h-[23px] w-[23px] items-center justify-center rounded-full pt-[3px] text-sm font-normal text-white",
          isArrayChanged ? "bg-lime-600" : "bg-[#cdb380]",
        )}
      >
        {isLoading ? (
          <ClockLoader size={19} className="mb-[3px]" color="white" />
        ) : isArrayChanged ? (
          <div onClick={submitHandler}>
            <IconContext.Provider
              value={{ size: "22", className: "-mt-[3px] cursor-pointer" }}
            >
              <TiTick />
            </IconContext.Provider>
          </div>
        ) : (
          convertToFarsiDigits(verse.id.split("_")[1])
        )}
      </div>
    </Fragment>
  );
};

export default Verse;
