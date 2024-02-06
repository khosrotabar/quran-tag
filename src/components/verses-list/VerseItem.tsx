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
  parentRef,
  setQuranResponseCopy,
  setActiveVerse,
  setReservedArray,
  setTagInput,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const childRef = useRef<HTMLDivElement | null>(null);
  const [childPosition, setChildPosition] = useState<{
    top: number;
    left: any;
    right: any;
  }>({ top: 40, left: 0, right: "auto" });

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

  const checkChildPosition = () => {
    const parentRect = parentRef.current?.getBoundingClientRect();
    const childRect = childRef.current?.getBoundingClientRect();

    if (parentRect && childRect) {
      if (childRect.left < parentRect.left) {
        setChildPosition({ ...childPosition, left: 0, right: "auto" });
      } else if (childRect.right > parentRect.right) {
        setChildPosition({ ...childPosition, left: "auto", right: 0 });
      }
    }

    requestAnimationFrame(checkChildPosition);
  };

  useEffect(() => {
    checkChildPosition();

    return () => {
      cancelAnimationFrame(requestAnimationFrame(checkChildPosition));
    };
  }, [childPosition]);

  return (
    <div className="relative">
      <div
        className={clsx(
          "cursor-pointer select-none rounded-[4px]",
          isClicked && "bg-[#003648] text-white",
          meaning !== "" && !isClicked && "bg-[#b1331da4] text-white",
        )}
        onClick={reservedWordsHandler}
      >
        {word.text}
      </div>
      {activeVerse?.[activeVerse.length - 1]?.id === word.id &&
        activeVerse?.[activeVerse.length - 1]?.position === index && (
          <div
            className="absolute z-50 flex items-center"
            ref={childRef}
            style={childPosition}
          >
            <input
              type="text"
              className="w-[250px] rounded-md border-2 border-slate-800 bg-white px-2 py-2 font-iranyekan text-[20px] text-[#303030] outline-none"
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
                className: "absolute left-3 cursor-pointer",
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
