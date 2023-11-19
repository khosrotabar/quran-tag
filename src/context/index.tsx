import React, { createContext, useReducer, Dispatch } from "react";

type ReservedWord = {
  text: string;
  id: string;
};

type ReservedWordsState = ReservedWord[];

type ReservedWordsAction =
  | { type: "ADD_RESERVED_WORD"; word: ReservedWord }
  | { type: "REMOVE_RESERVED_WORD"; id: string };

type ReservedWordsContextType = {
  reservedWords: ReservedWordsState;
  dispatch: Dispatch<ReservedWordsAction>;
};

const ReservedWordsContext = createContext<
  ReservedWordsContextType | undefined
>(undefined);

const reservedWordsReducer = (
  state: ReservedWordsState,
  action: ReservedWordsAction,
): ReservedWordsState => {
  switch (action.type) {
    case "ADD_RESERVED_WORD":
      return [...state, action.word];
    case "REMOVE_RESERVED_WORD":
      return state.filter((word) => word.id !== action.id);
    default:
      return state;
  }
};

type ReservedWordsProviderProps = {
  children: React.ReactNode;
};

const ReservedWordsProvider: React.FC<ReservedWordsProviderProps> = ({
  children,
}) => {
  const [reservedWords, dispatch] = useReducer(reservedWordsReducer, []);

  return (
    <ReservedWordsContext.Provider value={{ reservedWords, dispatch }}>
      {children}
    </ReservedWordsContext.Provider>
  );
};

export { ReservedWordsContext, ReservedWordsProvider };
