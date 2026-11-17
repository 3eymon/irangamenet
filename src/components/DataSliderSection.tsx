
import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import SliderCards from "./ui/SliderCards";
import { CollectionItem, sliderCardsType } from "../types/card.types";
import { SwiperProps } from "swiper/react";

type DataSliderSectionProps<T extends CollectionItem> = {
  data: T[] | null | undefined;
  isLoading: boolean;
  type: sliderCardsType;
  children?: ReactNode;
  className?: string;
  renderItems?: (items: T[]) => ReactNode;
  sliderProps?: SwiperProps;
};

export default function DataSliderSection<T extends CollectionItem>({
  data,
  isLoading,
  type,
  children,
  className,
  renderItems,
  sliderProps,
}: DataSliderSectionProps<T>) {
  const hasData = !!data?.length;

  return (
    <section>
      {children}

      <div className={className}>
        {isLoading ? (
          <SliderCards
            data={[]}
            type={type}
            isLoading
            sliderProps={sliderProps}
          />
        ) : hasData ? (
          renderItems ? (
            renderItems(data!)
          ) : (
            <SliderCards
              data={data!}
              type={type}
              sliderProps={sliderProps}
            />
          )
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
