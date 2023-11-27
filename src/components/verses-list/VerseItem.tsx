import React, { Dispatch, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { pageOuput } from "@/api";
import { activeVerseProps } from "@/shared";
import { deleteMeaning, transformArray } from "@/util";

type VerseItemProps = {
  index: number;
  word: {
    text: string;
    id: string;
  };
  activeVerse: activeVerseProps[];
  meaning: string;
  reservedArray: pageOuput[];
  quranResponseCopy: pageOuput[];
  tagInput: string;
  setQuranResponseCopy: Dispatch<pageOuput[]>;
  setActiveVerse: Dispatch<activeVerseProps[]>;
  setReservedArray: Dispatch<pageOuput[]>;
  setTagInput: Dispatch<string>;
};

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

  // transfer to util folder later
  const reservedArrayHandler = () => {
    const isSame = reservedArray.some(
      (item) => item.position === (index + 1).toString(),
    );

    const updatedArray = isSame
      ? reservedArray.filter((item) => item.position !== (index + 1).toString())
      : [
          ...reservedArray,
          {
            meaning: meaning !== "" ? meaning : "",
            word: word.text,
            position: (index + 1).toString(),
            id: word.id,
          },
        ];

    setReservedArray(updatedArray);
  };

  // transfer to util folder later
  const activeVersehandler = () => {
    const isSame = activeVerse.some((item) => item.position === index);

    const updatedArray = isSame
      ? activeVerse.filter((item) => item.position !== index)
      : [
          ...activeVerse,
          {
            position: index,
            id: word.id,
          },
        ];

    setActiveVerse(updatedArray);
  };

  const reservedWordsHandler = () => {
    setIsClicked(!isClicked);
    reservedArrayHandler();
    activeVersehandler();
    if (meaning !== "") {
      setTagInput(meaning);
    }
  };

  const keyboardHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputRef.current?.value === "") {
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
          reserve.meaning = inputRef.current?.value!;
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
          <div className="absolute z-10">
            <input
              type="text"
              className="w-[100px] rounded-md border-2 border-slate-800 bg-white px-2 py-1 text-sm outline-none"
              placeholder="معنی"
              onKeyUp={keyboardHandler}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              ref={inputRef}
            />
          </div>
        )}
    </div>
  );
};

export default VerseItem;
