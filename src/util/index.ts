import { mappedArrayProps, pageOuput } from "@/api";
import { activeVerseProps } from "@/shared";
import { Dispatch } from "react";
import { toast } from "react-toastify";

type InputArrayItem = {
  meaning: string;
  position: string;
  word: string;
  id?: string;
};

type OutputArrayItem = {
  meaning: string;
  position: string;
  word: string;
  id?: string;
};

export const notify = (
  text: string,
  type: "error" | "success" | "info" | "warn",
) => {
  let toastType = toast.warn;
  if (type === "success") {
    toastType = toast.success;
  } else if (type === "info") {
    toastType = toast.info;
  } else if (type === "error") {
    toastType = toast.error;
  }

  toastType(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const convertToFarsiDigits = (number: string) => {
  const farsiDigits: { [key: string]: string } = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };

  let farsiNumber = "";
  for (let i = 0; i < number.length; i++) {
    const digit = number.charAt(i);
    farsiNumber += farsiDigits[digit] || digit;
  }
  return farsiNumber;
};

export const convertToLatinDigits = (number: string) => {
  const farsiDigits: { [key: string]: string } = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  let farsiNumber = "";
  for (let i = 0; i < number.length; i++) {
    const digit = number.charAt(i);
    farsiNumber += farsiDigits[digit] || digit;
  }
  return farsiNumber;
};

export const generateArrayFromString = (
  text: string,
  wordId: string,
  raw: string,
  quranResponseCopy: pageOuput[],
) => {
  const words = text.split(" ");
  const raws = raw.split(" ");

  const mappedArray = words.map((word, index) => {
    const foundObject = quranResponseCopy?.find((item) => {
      const positionArray = item.position
        .split(",")
        .map((sub) => parseInt(sub.trim(), 10));

      return positionArray.includes(index + 1);
    });
    return {
      text: word,
      id: wordId,
      raw: raws[index],
      meaning: foundObject ? foundObject.meaning : "",
      position: (index + 1).toString(),
    };
  });

  // console.log(quranResponseCopy);

  // console.log(mergePositions(mappedArray, quranResponseCopy));

  return mergePositions(mappedArray, quranResponseCopy);
};

const mergePositions = (
  arrA: mappedArrayProps[],
  arrB: pageOuput[],
): (mappedArrayProps | null)[] => {
  const result: (mappedArrayProps | null)[] = [...arrA];

  arrB.forEach((itemB) => {
    const positions = itemB.position.split(",").map((pos) => pos.trim());

    if (positions.length > 1) {
      const sortedPositions = positions
        .slice()
        .sort((a: string, b: string) => parseInt(a) - parseInt(b));

      const isConsecutive = sortedPositions.every((pos, index) => {
        if (index === 0) return true;
        return parseInt(pos) - parseInt(sortedPositions[index - 1]) === 1;
      });

      if (isConsecutive) {
        const existingIndices = positions.map((pos) =>
          result.findIndex((itemA) => itemA?.position === pos),
        );

        const existingItems = existingIndices.map((index) =>
          index !== -1 ? { ...result[index] } : null,
        );

        const mergedText = existingItems
          .map((item) => (item ? item.text : ""))
          .join(" ");
        const mergedRaw = existingItems
          .map((item) => (item ? item.raw : ""))
          .join(" ");

        const mergedPositions = positions.join(", ");

        const updatedItemIndex = existingIndices.find((index) => index !== -1);

        if (updatedItemIndex !== undefined) {
          result[updatedItemIndex] = {
            text: mergedText,
            raw: mergedRaw,
            meaning: itemB.meaning,
            position: mergedPositions,
            id: itemB.id || "", // Ensure id is defined
          };
        }

        existingIndices.forEach((index) => {
          if (index !== updatedItemIndex) {
            result[index] = null;
          }
        });
      }
    }
  });

  return result;
};

export const getQuranResponseObject = (
  position: string,
  quranResponse: pageOuput[],
) => {
  if (quranResponse?.length !== 0) {
    const foundItem = quranResponse.find((item) => {
      const positionArray = item.position.includes(",")
        ? item.position.split(", ")
        : [item.position];
      const isExist = positionArray.some((item) => item === position);
      if (isExist) {
        return item;
      }
    });
    return foundItem;
  }
  return undefined;
};

export const deleteMeaning = (
  quranResponseCopy: pageOuput[],
  index: number,
) => {
  return quranResponseCopy.filter((item) => {
    const positionArray = item.position
      .split(",")
      .map((sub) => parseInt(sub.trim(), 10));
    return !positionArray.includes(index + 1);
  });
};

export const transformArray = (
  inputArray: InputArrayItem[],
): OutputArrayItem[] => {
  const groupedItems: { [key: string]: OutputArrayItem } = {};

  inputArray.forEach((item) => {
    if (!groupedItems[item.meaning]) {
      groupedItems[item.meaning] = {
        meaning: item.meaning,
        position: item.position,
        word: item.word,
        id: item.id,
      };
    } else {
      groupedItems[item.meaning].position += `, ${item.position}`;
      groupedItems[item.meaning].word += ` ${item.word}`;
    }
  });

  return Object.values(groupedItems);
};

export const reservedArrayHandler = (
  reservedArray: pageOuput[],
  index: number,
  meaning: string,
  word: {
    text: string;
    id: string;
  },
  setReservedArray: Dispatch<pageOuput[]>,
) => {
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

export const activeVersehandler = (
  activeVerse: activeVerseProps[],
  index: number,
  word: {
    text: string;
    id: string;
  },
  setActiveVerse: Dispatch<activeVerseProps[]>,
) => {
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
