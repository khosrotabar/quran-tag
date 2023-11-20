import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FaCheck } from "react-icons/fa6";
import { LuChevronsUpDown } from "react-icons/lu";
import { quran_suras, quran_data } from "@/data";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";

type QuranListProps = {
  page: number;
};

const QuranList: React.FC<QuranListProps> = ({ page }) => {
  const [selected, setSelected] = useState({ text: "" });
  const [query, setQuery] = useState("");
  const [matchedSurasData, setMatchedSurasData] = useState<{ text: string }>({
    text: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const matchedSuras = quran_data.filter((item) =>
      item.data.some((data) => data.page === page),
    );

    if (matchedSuras.length > 0) {
      setMatchedSurasData({ text: matchedSuras[0].title.text });
    } else {
      setMatchedSurasData({ text: "" });
    }
  }, [page]);

  useEffect(() => {
    setSelected(matchedSurasData);
  }, [matchedSurasData]);

  const clickHandler = (value: { text: string }) => {
    setSelected(value);
    const foundData = quran_data.find((item) => item.title.text === value.text);
    const page = foundData?.title.page;

    navigate(`/?page=${page}`);
  };

  const filteredSuras =
    query === ""
      ? quran_suras
      : quran_suras.filter((sura) =>
          sura.text
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <Combobox value={selected} onChange={clickHandler}>
      <div className="relative w-full">
        <div className="relative w-full cursor-default overflow-hidden rounded-r-[4px] bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none bg-[#003648] py-2 pl-3 pr-10 text-sm leading-5 text-white outline-none focus:ring-0"
            displayValue={(sura: { text: string }) => sura.text}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className="cursor-pointer">
              <IconContext.Provider value={{ color: "white", size: "20px" }}>
                <LuChevronsUpDown />
              </IconContext.Provider>
            </div>
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredSuras.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredSuras.map((sura, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={sura}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {sura.text}
                      </span>
                      {selected ? (
                        <span
                          className={
                            "absolute inset-y-0 left-0 flex items-center pl-3"
                          }
                        >
                          <div className="cursor-pointer">
                            <IconContext.Provider
                              value={{
                                color: active ? "white" : "#24a99f",
                                size: "24px",
                              }}
                            >
                              <FaCheck />
                            </IconContext.Provider>
                          </div>
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default QuranList;
