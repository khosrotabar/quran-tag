import { ocrBaseUrl } from "@/config";
import { DocumentReaderType } from "@/shared";
import axios from "axios";

interface lastData {
  id: string;
  page: string;
}

interface submitOutput {
  status: string;
}

export interface pageOuput {
  meaning: string;
  position: string;
  word: string;
  id?: string;
}

export interface mappedArrayProps {
  id: string;
  text: string;
  raw: string;
  meaning: string;
  position: string;
}

export const getLastEdit = async (): Promise<lastData> => {
  const { data } = await axios.get("/api/last_edit/");
  return data;
};

export const getPage = async (
  page: number,
  verse: string,
): Promise<pageOuput[] | undefined> => {
  try {
    const { data } = await axios.get(`/api/${page}/${verse}/`);
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const submitTags = async (
  quranData: pageOuput[],
  page: number,
  id: string,
): Promise<submitOutput | undefined> => {
  try {
    const { data } = await axios.post(`/api/${page}/${id}/`, quranData);
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const getCopyBoard = async (
  versId: string,
): Promise<{ [key: string]: string } | undefined> => {
  try {
    const { data } = await axios.get(`/api/words/${versId}/`);
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const getJsonOcr = async (page: number): Promise<DocumentReaderType> => {
  const { data } = await axios.get(`${ocrBaseUrl}/ocr/${page}.json`);

  return data;
};
