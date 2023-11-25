import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import VrsesList from "../../components/verses-list";
import { quran_data } from "@/data";
import { getLastEdit } from "@/api";
import { useEffect } from "react";

const Home = () => {
  const { data, error, isLoading } = useQuery("lastEdit", getLastEdit);
  let page;
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlPage = parseInt(urlParams.get("page")!);
  const quranSuraLength = quran_data.length - 1;
  const quranLastDataLength = quran_data[quranSuraLength].data.length - 1;
  const maxPage = quran_data[quranSuraLength].data[quranLastDataLength].page;
  const navigate = useNavigate();

  if (error) {
    console.log(error); // for now
  }

  useEffect(() => {
    if (data) {
      const lastEditpage = data.page;
      navigate(`/?page=${lastEditpage}`);
    }
  }, [data]);

  if (urlPage > 0 && urlPage < maxPage) {
    page = urlPage;
  } else if (urlPage >= maxPage) {
    page = maxPage;
  } else if (urlPage < 0) {
    page = 1;
  } else {
    page = 1;
  }

  return (
    <div dir="rtl" className="select-none">
      <VrsesList page={page} lastEditId={data?.id} isLoading={isLoading} />
    </div>
  );
};

export default Home;
