import React, { useContext } from "react";
import clsx from "clsx";
import { ReservedWordsContext } from "@/context";

type VerseItemProps = {
  word: {
    text: string;
    id: string;
  };
};

const VerseItem: React.FC<VerseItemProps> = ({ word }) => {
  const contextValue = useContext(ReservedWordsContext);

  if (!contextValue) {
    return null;
  }

  const { reservedWords, dispatch } = contextValue;

  const reservedWordsHandler = (word: { text: string; id: string }) => {
    if (!reservedWords.some((element) => element.id === word.id)) {
      dispatch({ type: "ADD_RESERVED_WORD", word: word });
    } else {
      dispatch({ type: "REMOVE_RESERVED_WORD", id: word.id });
    }
  };

  return (
    <div
      key={word.id}
      className={clsx(
        "cursor-pointer select-none",
        reservedWords.some((element) => element.id === word.id) &&
          "rounded-[4px] bg-[#003648] text-white",
      )}
      onClick={() => reservedWordsHandler(word)}
    >
      {word.text}
    </div>
  );
};

export default VerseItem;
