import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "../../../components/ui/Image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PREVIEW_COUNT = 3;

const MODULES = [Navigation, Pagination, Keyboard, A11y];
const PAGINATION = { type: "fraction" as const };
const KEYBOARD = { enabled: true };

const swiperClass =
  "h-full w-full " +
  "[--swiper-navigation-size:28px] [--swiper-navigation-color:#fff] " +
  "[&_.swiper-button-prev]:max-sm:!hidden [&_.swiper-button-next]:max-sm:!hidden " +
  "[&_.swiper-pagination]:!bottom-4 [&_.swiper-pagination]:text-sm [&_.swiper-pagination]:font-bold [&_.swiper-pagination]:text-white";

type Props = {
  screenshots?: string[] | null;
  title: string;
};

function ScreenshotGallery({ screenshots, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  if (!screenshots?.length) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 px-4 text-center">
        <div className="rounded-full bg-white/5 p-3">
          <PhotoIcon className="size-6 text-gray-500" />
        </div>
        <div>
          <p className="text-sm text-gray-300">تصویری موجود نیست</p>
          <p className="mt-1 text-xs text-gray-500">
            تصاویر این بازی هنوز اضافه نشده‌اند.
          </p>
        </div>
      </div>
    );
  }

  const remaining = screenshots.length - PREVIEW_COUNT;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {screenshots.slice(0, PREVIEW_COUNT).map((screenshot, index) => {
          const hasMore = index === PREVIEW_COUNT - 1 && remaining > 0;

          return (
            <button
              key={`${screenshot}-${index}`}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={
                hasMore
                  ? `مشاهده ${remaining} تصویر دیگر`
                  : `نمایش بزرگ تصویر ${index + 1}`
              }
              className="group relative block min-w-0 cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-[#1b2432] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            >
              <Image
                src={screenshot}
                alt={`تصویر ${index + 1} بازی ${title}`}
                className={`aspect-video w-full object-cover transition-transform duration-500 ${
                  hasMore ? "brightness-50" : "group-hover:scale-105"
                }`}
              />

              {hasMore && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5 text-white backdrop-blur-[2px] transition group-hover:bg-black/10">
                  <div className="rounded-full border border-white/20 bg-white/10 p-1.5 sm:p-3">
                    <PhotoIcon className="size-4 sm:size-6" />
                  </div>

                  <span className="text-xs font-semibold sm:text-sm">
                    مشاهده {remaining} تصویر دیگر
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <PhotoViewer
            key="photo-viewer"
            images={screenshots}
            title={title}
            startIndex={openIndex}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

type ViewerProps = {
  images: string[];
  title: string;
  startIndex: number;
  onClose: () => void;
};

function PhotoViewer({ images, title, startIndex, onClose }: ViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevFocus = document.activeElement as HTMLElement | null;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    dialogRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`تصاویر بازی ${title}`}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-[100] bg-black/95 outline-none"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-300"
      >
        <XMarkIcon className="size-6" />
      </button>

      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        <Swiper
          dir="rtl"
          modules={MODULES}
          initialSlide={startIndex}
          navigation
          pagination={PAGINATION}
          keyboard={KEYBOARD}
          spaceBetween={24}
          speed={350}
          threshold={5}
          grabCursor
          className={swiperClass}
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <div
                onClick={closeOnBackdrop}
                className="flex h-full w-full items-center justify-center px-4 py-16 sm:px-16"
              >
                <img
                  src={src}
                  alt={`تصویر ${i + 1} بازی ${title}`}
                  loading={Math.abs(i - startIndex) <= 1 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="max-h-full max-w-full select-none rounded-lg object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default memo(ScreenshotGallery);