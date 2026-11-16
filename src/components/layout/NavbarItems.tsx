import { ReactNode } from "react";
import {
  BookOpenIcon,
  HomeIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { SiYoutubegaming } from "react-icons/si";

export type NavbarItemType = {
  id: number;
  title: string;
  link: string;
  icon: ReactNode;
};
export const navbarItems: NavbarItemType[] = [
  {
    id: 1,
    title: "خانه",
    link: "/",
    icon: (
      <HomeIcon className="inline-block h-5 w-5 group-aria-[current=page]:[filter:drop-shadow(-25px_0px_10px_#c084fc)]" />
    ),
  },
  {
    id: 3,
    title: "اخبار",
    link: "/news",
    icon: (
      <BookOpenIcon className="inline-block h-5 w-5 group-aria-[current=page]:[filter:drop-shadow(-25px_0px_10px_#c084fc)]" />
    ),
  },
  {
    id: 4,
    title: "بازی ها",
    link: "/games",
    icon: (
      <PuzzlePieceIcon className="inline-block h-5 w-5 group-aria-[current=page]:[filter:drop-shadow(-25px_0px_10px_#c084fc)]" />
    ),
  },
  {
    id: 5,
    title: "استریمر ها",
    link: "/streamers",
    icon: (
      <VideoCameraIcon className="inline-block h-5 w-5 group-aria-[current=page]:[filter:drop-shadow(-25px_0px_10px_#c084fc)]" />
    ),
  },
  {
    id: 6,
    title: "گیم نت ها",
    link: "/game-centers",
    icon: (
      <SiYoutubegaming className="inline-block h-5 w-5 group-aria-[current=page]:[filter:drop-shadow(-25px_0px_10px_#c084fc)]" />
    ),
  },
];
