import { pageOuput } from "@/api";
import { Dispatch } from "react";

export interface verseProps {
  page: number;
  text: string;
  raw: string;
  id: string;
}

export interface activeVerseProps {
  id: string;
  position: number;
}

export type VerseItemProps = {
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

export type VerseProps = {
  innerIndex: number;
  verse: verseProps;
  quranResponse: pageOuput[];
  page: number;
  pageToSubmit: number;
};

export type VrsesListProps = {
  page: number;
};
