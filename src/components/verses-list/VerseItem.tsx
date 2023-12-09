import React, { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IconContext } from "react-icons";
import clsx from "clsx";
import { VerseItemProps } from "@/shared";
import {
  activeVersehandler,
  deleteMeaning,
  reservedArrayHandler,
  transformArray,
} from "@/util";

const VerseItem: React.FC<VerseItemProps> = ({
  index,
  word,
  activeVerse,
  meaning,
  reservedArray,
  quranResponseCopy,
  tagInput,
  setQuranResponseCopy,
  setActiveVerse,
  setReservedArray,
  setTagInput,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reservedWordsHandler = () => {
    setIsClicked(!isClicked);
    reservedArrayHandler(reservedArray, index, meaning, word, setReservedArray);
    activeVersehandler(activeVerse, index, word, setActiveVerse);
    if (meaning !== "") {
      setTagInput(meaning);
    }
  };

  const keyboardHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event?.key === "Enter") {
      if (inputVal === "") {
        setReservedArray([]);
        if (meaning !== "") {
          setQuranResponseCopy(deleteMeaning(quranResponseCopy, index));
        }
      } else {
        const folteredQuranResponseCopy = deleteMeaning(
          quranResponseCopy,
          index,
        );
        const newReservedArray = reservedArray.map((reserve) => {
          reserve.meaning = inputVal;
          return reserve;
        });

        const transformedArray = transformArray(newReservedArray);

        setQuranResponseCopy(
          folteredQuranResponseCopy.concat(transformedArray),
        );

        setReservedArray([]);
      }
    }
  };

  useEffect(() => {
    if (reservedArray.length === 0) {
      setIsClicked(false);
    }
  }, [reservedArray]);

  useEffect(() => {
    if (tagInput !== "") {
      setInputVal(tagInput);
    } else {
      setInputVal("");
    }
  }, [tagInput]);

  const closeInputHandler = () => {
    setInputVal("");
    setReservedArray([]);
    if (meaning !== "") {
      setQuranResponseCopy(deleteMeaning(quranResponseCopy, index));
    }
  };

  return (
    <div>
      <div
        className={clsx(
          "relative cursor-pointer select-none rounded-[4px]",
          isClicked && "bg-[#003648] text-white",
          meaning !== "" && !isClicked && "bg-[#b1331da4] text-white",
        )}
        onClick={reservedWordsHandler}
      >
        {word.text}
      </div>
      {activeVerse?.[activeVerse.length - 1]?.id === word.id &&
        activeVerse?.[activeVerse.length - 1]?.position === index && (
          <div className="absolute z-10 flex">
            <input
              type="text"
              className="font-iranyekan absolute w-[250px] rounded-md border-2 border-slate-800 bg-white px-2 py-1 text-[20px] text-[#303030] outline-none"
              placeholder="معنی"
              onKeyUp={keyboardHandler}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              ref={inputRef}
            />
            <IconContext.Provider
              value={{
                color: "red",
                size: "24",
                className: "z-50 mt-2 mr-[220px] cursor-pointer",
                attr: { onClick: closeInputHandler },
              }}
            >
              <CgClose />
            </IconContext.Provider>
          </div>
        )}
    </div>
  );
};

export default VerseItem;
