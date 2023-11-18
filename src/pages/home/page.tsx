import { useLocation } from "react-router-dom";
import VrsesList from "../../components/verses-list";

const Home = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const page = parseInt(urlParams.get("page")!) ?? 1;

  return (
    <div dir="rtl">
      <VrsesList page={page} />
    </div>
  );
};

export default Home;
