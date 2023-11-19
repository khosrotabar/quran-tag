import { useLocation } from "react-router-dom";
import VrsesList from "../../components/verses-list";
import { quran_data } from "@/data";

const Home = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlPage = parseInt(urlParams.get("page")!);
  const maxPage =
    quran_data[quran_data.length - 1].data[
      quran_data[quran_data.length - 1].data.length - 1
    ].page;
  let page;

  if (urlPage > 0 && urlPage < maxPage) {
    page = urlPage;
  } else if (urlPage > maxPage) {
    page = maxPage;
  } else if (urlPage < 0) {
    page = 1;
  } else {
    page = 1;
  }

  return (
    <div dir="rtl" className="select-none">
      <VrsesList page={page} />
    </div>
  );
};

export default Home;
