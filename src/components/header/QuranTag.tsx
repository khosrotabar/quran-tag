import { ReservedWordsContext } from "@/context";
import clsx from "clsx";
import { useContext, useRef } from "react";
import { toast } from "react-toastify";

const QuranTag = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const contextValue = useContext(ReservedWordsContext);

  if (!contextValue) {
    return null;
  }

  const { reservedWords } = contextValue;

  const notify = (text: string) =>
    toast.warn(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const submitHabdler = () => {
    if (inputRef && inputRef.current?.value !== "") {
      console.log(inputRef.current?.value);
      console.log(reservedWords);
    } else {
      notify("تگ نباید خالی باشد");
    }
  };

  return (
    <div
      className={clsx(
        "absolute left-0 top-0 z-50 flex w-full items-center gap-[6px] overflow-hidden rounded-[10px] bg-[#001633] px-[6px] transition-all duration-200",
        reservedWords.length !== 0 ? "h-[46px]" : "h-0",
      )}
    >
      <input
        ref={inputRef}
        type="text"
        className="h-[36px] w-[80%] basis-10/12 rounded-[5px] border-none px-[16px] text-base text-[#001633] outline-none placeholder:text-sm"
        placeholder="تگ قرآن"
      />
      <button
        className="h-[36px] basis-2/12 rounded-[5px] bg-white font-rranyekan"
        onClick={submitHabdler}
      >
        ثبت
      </button>
    </div>
  );
};

export default QuranTag;
