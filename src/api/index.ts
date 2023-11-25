import axios from "axios";

interface lastData {
  id: string;
  page: string;
}

export const getLastEdit = async (): Promise<lastData> => {
  const { data } = await axios.get("/api/last_edit/");
  return data;
};
