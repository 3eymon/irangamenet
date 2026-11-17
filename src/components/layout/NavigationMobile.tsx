import { Link, NavLink } from "react-router-dom";
import {
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { navbarItems } from "./NavbarItems";
import "./navigation.css";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "../ui/Image";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";

const RADIUS = 1200;
const START_RADIUS = 20; 
const START_SCALE = START_RADIUS / RADIUS;
const CENTER_OPEN = 40; 
const CENTER_CLOSED_X = 205; 
const SHIFT_X = CENTER_CLOSED_X - CENTER_OPEN;

const openTransition = {
  type: "spring",
  stiffness: 20,
  restDelta: 0.02,
  restSpeed: 0.02,
} as const;

const closeTransition = {
  delay: 0.5,
  type: "spring",
  stiffness: 400,
  damping: 40,
  restDelta: 0.01,
} as const;

export default function NavigationMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const progress = useMotionValue(0);
  const x = useTransform(progress, [0, 1], [SHIFT_X, 0]);
  const scale = useTransform(progress, [0, 1], [START_SCALE, 1]);

  useEffect(() => {
    const controls = animate(
      progress,
      isOpen ? 1 : 0,
      isOpen ? openTransition : closeTransition,
    );
    return () => controls.stop();
  }, [isOpen, progress]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setIsOpen(false);
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="absolute inset-0 sm:hidden"
    >
      <div
        onClick={toggle}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div className="background pointer-events-none absolute bottom-0 right-px top-0 z-30 w-60 overflow-hidden">
        <motion.div
          className="absolute rounded-full bg-[#29293df2]"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            left: CENTER_OPEN - RADIUS,
            top: CENTER_OPEN - RADIUS,
            x,
            scale,
            willChange: "transform",
          }}
        />
      </div>

      <div className="relative">
        <Navigation toggle={toggle} isOpen={isOpen} />
        <MenuToggle toggle={toggle} />
      </div>
    </motion.div>
  );
}

type PathProps = ComponentProps<typeof motion.path>;

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = memo(function MenuToggle({
  toggle,
}: {
  toggle: () => void;
}) {
  return (
    <motion.div className="relative">
      <button id="toggle-button" onClick={toggle} className="z-30 pr-2.5">
        <svg
          width="23"
          height="23"
          viewBox="0 0 23 23"
          className="w-5 text-white invert"
        >
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
            }}
          />
        </svg>
      </button>
    </motion.div>
  );
});

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const variantsItem = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const Navigation = memo(function Navigation({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) {
  const { user, profile, isLoading, logout, isLoggingOut } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <motion.ul
      variants={variants}
      dir="rtl"
      className={`absolute right-0 top-16 z-40 flex w-[241px] flex-col overflow-hidden text-white ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.li variants={variantsItem} className="px-3 pb-3 pt-4">
        <span className="mb-2 block px-2 text-[11px] text-zinc-500">
          حساب کاربری
        </span>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 rounded-xl bg-[#383950] px-3 py-3"
            >
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-zinc-600/70" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-600/70" />
                <div className="h-2 w-16 animate-pulse rounded bg-zinc-700/70" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={user ? "user" : "guest"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                onClick={toggle}
                to={user ? "/profile" : "/auth"}
                className="flex items-center gap-3 rounded-xl bg-[#383950] px-3 py-3 transition-colors active:bg-[#41435e]"
              >
                {user ? (
                  <Image
                    icon
                    src={profile?.avatar_path}
                    alt="تصویر پروفایل"
                    className="size-9 shrink-0 rounded-full bg-black object-cover !p-0.5"
                  />
                ) : (
                  <UserCircleIcon className="size-9 shrink-0 text-zinc-300" />
                )}

                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={`truncate text-sm ${
                      user ? "text-primary-300" : "text-zinc-200"
                    }`}
                  >
                    {user
                      ? profile?.display_name?.trim() || "حساب کاربری"
                      : "ورود / ثبت‌نام"}
                  </span>

                  <span className="text-[11px] text-zinc-400">
                    {user ? "مشاهده پروفایل" : "به حساب خود وارد شوید"}
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.li>

      <motion.li
        variants={variantsItem}
        className="mx-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <motion.li variants={variantsItem} className="px-3 pb-1 pt-3">
        <span className="mb-2 block px-2 text-[11px] text-zinc-500">
          منوی اصلی
        </span>
      </motion.li>

      {navbarItems.map((i) => (
        <motion.li
          key={i.id}
          variants={variantsItem}
          className="flex w-full items-center px-3 py-1"
        >
          <NavLink
            onClick={toggle}
            to={i.link}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition-colors aria-[current=page]:bg-[#383950] aria-[current=page]:font-PeydaMed aria-[current=page]:text-purple-400"
          >
            {i.icon}
            {i.title}
          </NavLink>
        </motion.li>
      ))}

      {user && !isLoading && (
        <>
          <motion.li
            variants={variantsItem}
            className="mx-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          <motion.li variants={variantsItem} className="px-3 py-3">
            <span className="mb-2 block px-2 text-[11px] text-zinc-500">
              مدیریت حساب
            </span>

            <AnimatePresence mode="wait" initial={false}>
              {confirmLogout ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2 rounded-xl bg-red-500/5 p-3"
                >
                  <p className="text-xs text-zinc-400">
                    از خروج از حساب خود مطمئن هستید؟
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={logout}
                      disabled={isLoggingOut}
                      className="flex-1 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                    >
                      {isLoggingOut ? "در حال خروج..." : "تأیید خروج"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmLogout(false)}
                      disabled={isLoggingOut}
                      className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-white/10 disabled:opacity-50"
                    >
                      لغو
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="logout"
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setConfirmLogout(true)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10 active:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeftEndOnRectangleIcon className="size-5 shrink-0" />
                  خروج از حساب
                </motion.button>
              )}
            </AnimatePresence>
          </motion.li>
        </>
      )}
    </motion.ul>
  );
});