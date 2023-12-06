import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IconContext } from "react-icons";
import QuranList from "./QuranList";

type HeaderProps = {
  page: number;
  lastPage: number;
  isLoading: boolean;
};

const Header: React.FC<HeaderProps> = ({ page, lastPage, isLoading }) => {
  const [inputVal, setInputVal] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    !isLoading && setInputVal(page.toString());
  }, [page, isLoading]);

  const inputHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(`/?page=${inputVal}`);
    }
  };

  const arrowHandler = (value: string) => {
    if (value === "next" && parseInt(inputVal) !== lastPage) {
      navigate(`/?page=${parseInt(inputVal)! + 1}`);
    }

    if (value === "prev" && parseInt(inputVal) !== 1) {
      navigate(`/?page=${parseInt(inputVal)! - 1}`);
    }
  };

  return (
    <div className="relative z-40 mb-4 flex h-[46px] w-full items-center justify-center rounded-[10px] bg-[#001633] font-rranyekan">
      <div className="absolute left-0 top-0 h-[46px] w-[50%] rounded-l-[10px] bg-[#001633]">
        <div className="mx-auto flex h-full w-[120px]  items-center justify-between">
          <div className="cursor-pointer" onClick={() => arrowHandler("next")}>
            <IconContext.Provider value={{ color: "white", size: "24px" }}>
              <IoIosArrowForward />
            </IconContext.Provider>
          </div>
          <input
            type="text"
            value={inputVal}
            onKeyDown={inputHandler}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-[70px] border-none bg-inherit text-center text-sm text-white outline-none placeholder:text-white placeholder:opacity-50"
            placeholder="page"
          />
          <div className="cursor-pointer" onClick={() => arrowHandler("prev")}>
            <IconContext.Provider value={{ color: "white", size: "24px" }}>
              <IoIosArrowBack />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-[46px] w-[50%] items-center justify-center rounded-r-[10px] bg-[#003648]">
        {!isLoading && <QuranList page={page} />}
      </div>
    </div>
  );
};

export default Header;
