import React, { useContext, useState } from "react";
import clsx from "clsx";
import { ReservedWordsContext } from "@/context";
import { pageOuput } from "@/api";

type VerseItemProps = {
  word: {
    text: string;
    id: string;
  };
  responseObject: pageOuput | undefined;
};

const VerseItem: React.FC<VerseItemProps> = ({ word, responseObject }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const contextValue = useContext(ReservedWordsContext);

  if (!contextValue) {
    return null;
  }

  const { reservedWords, dispatch } = contextValue;

  const reservedWordsHandler = (word: { text: string; id: string }) => {
    setIsClicked(!isClicked);
    if (!reservedWords.some((element) => element.id === word.id)) {
      dispatch({ type: "ADD_RESERVED_WORD", word: word });
    } else {
      dispatch({ type: "REMOVE_RESERVED_WORD", id: word.id });
    }
  };

  return (
    <div
      className={clsx(
        "cursor-pointer select-none rounded-[4px]",
        isClicked && "bg-[#003648] text-white",
        responseObject &&
          responseObject.meaning !== "" &&
          !isClicked &&
          "bg-[#b1331da4] text-white",
      )}
      onClick={() => reservedWordsHandler(word)}
    >
      {word.text}
    </div>
  );
};

export default VerseItem;
