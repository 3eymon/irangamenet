import useInc from "../../../hooks/useInc";

function Header({ scroll }: { scroll: () => void }) {
  const creaedGames = useInc(980);
  const hTraller = useInc(568);
  return (
    <div className="z-10 mx-auto flex min-h-[100vh] flex-col justify-evenly">
      <div className="flex h-full flex-col items-center md:flex-row md:gap-20">
        <div className="relative">
          <img
            src="images/games/Character.png"
            alt="Game character"
            width={410}
            height={410}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="animate-fade-up [filter:drop-shadow(-5px_20px_7px_black)]"
          />
          <div className="font-PeydaBlack absolute left-12 top-20 m-0 flex animate-fade-left flex-col items-center justify-center gap-0 rounded-full bg-white/35 p-0 px-5 py-1 text-xs text-gray-300 shadow-2xl backdrop-blur-md">
            <span className="m-0 p-0 text-lg text-yellow-400">
              {creaedGames}
            </span>{" "}
            بازی ثبت شده{" "}
          </div>
          <div className="font-PeydaBlack absolute bottom-44 right-16 m-0 flex animate-fade-right flex-col items-center justify-center gap-0 rounded-full bg-white/35 p-0 px-5 py-1 text-xs text-gray-300 shadow-2xl backdrop-blur-md">
            <span className="m-0 p-0 text-lg text-green-400">{hTraller}</span>{" "}
            ساعت تریلر{" "}
          </div>
        </div>
        <div className="flex max-w-80 flex-col gap-5">
          <h2 className="font-PeydaBlack text-3xl text-red-500">
            فقط یه بازی انتخاب کن
          </h2>
          <p className="text-sm text-gray-400">
            همین الان یک بازی انتخاب کن و هرچی میخوای درموردش بفهم پس منتظر چی
            هستی د یالا از قدیم گفتن وقت طلاست ما هم برات بدون چیز اضافه ای
            مطالب مهم رو هایلایت کردیم
          </p>
        </div>
      </div>
      <img
        onClick={scroll}
        src="images/games/88221.png"
        className="mx-auto w-6 animate-bounce cursor-pointer invert animate-duration-[2000ms] animate-infinite animate-ease-linear"
      />
    </div>
  );
}

export default Header;
