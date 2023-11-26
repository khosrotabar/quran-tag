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
) => {
  const words = word.split(" ");
  const raws = raw.split(" ");

  const mappedArray = words.map((word, index) => {
    return {
      text: word,
      id: wordId,
      raw: raws[index],
    };
  });

  return mappedArray;
};
