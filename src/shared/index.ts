import { pageOuput } from "@/services/api";
import { Dispatch, RefObject } from "react";

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
  parentRef: RefObject<HTMLDivElement>;
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
  parentRef: RefObject<HTMLDivElement>;
};

export type VrsesListProps = {
  page: number;
};

export type DirectionType = "rtl" | "ltr";

type LineColumnType = {
  box: string;
  words: string[];
  probability: number;
  text: string;
};

type ColumnType = {
  box: string;
  text: string;
  lines: LineColumnType[];
  direction: DirectionType;
};

type RowsType = {
  box: string;
  columns: ColumnType[];
};
type LineType = {
  box: string;
  label: number;
  is_bold: boolean;
  probability: number;
  text: string;
};

type PartType = {
  box: string;
  lines?: LineType[];
  text?: string;
  direction?: DirectionType;
  type: "text" | "image";
  rows?: RowsType[]; // sometimes part type is table and table has list of rows
};

export type PageType = {
  parts: PartType[];
  text: string;
  width: number;
  height: number;
  angle: number;
  page_url: string;
};

export type DocumentReaderType = {
  pages: PageType[];
  document_url: string;
};
