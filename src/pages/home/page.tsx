import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { BarLoader } from "react-spinners";
import VrsesList from "../../components/verses-list";
import { quran_data } from "@/data";
import { getLastEdit } from "@/api";

const Home = () => {
  const { data, error, isLoading } = useQuery("lastEdit", getLastEdit);
  let page;
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlPage = parseInt(urlParams.get("page")!);
  const quranSuraLength = quran_data.length - 1;
  const quranLastDataLength = quran_data[quranSuraLength].data.length - 1;
  const maxPage =
    quran_data[quranSuraLength].data[quranLastDataLength].currentPage;
  const navigate = useNavigate();

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
  //       page++;
  //       quranData.data[i].currentPage = page;
  //     }
  //   }

  //   console.log(quranDataCopy);
  // };

  // useEffect(() => {
  //   quranArrayHandler();
  // }, []);

  // javascript - temporary function

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

  if (isLoading) {
    return (
      <div className="absolute inset-0 m-auto h-fit w-fit">
        <BarLoader color="#003648" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="flex h-screen w-screen select-none items-center justify-center"
      >
        <span className="rounded-md bg-red-600 px-4 py-2 text-base font-bold text-white shadow-md">
          مشکلی در سرور بوجود آمده است. لطفا بعد از مدتی دوباره امتحان کنید.
        </span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div dir="rtl" className="select-none">
      <VrsesList page={page} lastEditId={data?.id} isLoading={false} />
    </div>
  );
};

export default Home;
