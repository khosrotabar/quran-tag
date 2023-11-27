import { pageOuput } from "@/api";

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

export const generateArrayFromString = (
  word: string,
  wordId: string,
  raw: string,
  quranResponseCopy: pageOuput[],
) => {
  const words = word.split(" ");
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
    };
  });

  return mappedArray;
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
