import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import VrsesList from "../../components/verses-list";
import { quran_data } from "@/data";
import Document from "@/components/document/Document";

const Home = () => {
  let page;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlPage = parseInt(urlParams.get("page")!);
  const quranSuraLength = quran_data.length - 1;
  const quranLastDataLength = quran_data[quranSuraLength].data.length - 1;
  const maxPage = quran_data[quranSuraLength].data[quranLastDataLength].page;
  const navigate = useNavigate();
  const lastPageEdited: string | null = localStorage.getItem("lastPageEdited");

  useEffect(() => {
    if (lastPageEdited) {
      setIsLoading(false);
      navigate(`/?page=${lastPageEdited}`);
    } else {
      setIsLoading(false);
    }
  }, []);

  // javascript - temporary function

  // const quranArrayHandler = () => {
  //   const quranDataCopy = [...quran_data];
  //   let page = 0;

  //   for (const quranData of quranDataCopy) {
  //     page++;
  //     // quranData.title.page = page;
  //     quranData.title.currentPage = page;
  //     quranData.data[0].currentPage = page;
  //     for (var i = 1; i < quranData.data.length; i++) {
  //       // page++;
  //       quranData.data[i].currentPage = page;
  //     }
  //   }

  //   console.log(quranDataCopy);
  // };

  // useEffect(() => {
  //   quranArrayHandler();
  // }, []);

  // javascript - temporary function

  if (urlPage > 0 && urlPage < maxPage) {
    page = urlPage;
  } else if (urlPage >= maxPage) {
    page = maxPage;
  } else if (urlPage < 0) {
    page = 1;
  } else {
    page = 1;
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 m-auto h-fit w-fit">
        <BarLoader color="#003648" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex h-full items-center justify-center gap-5">
      <VrsesList page={page} />
      <Document page={page} />
    </div>
  );
};

export default Home;
