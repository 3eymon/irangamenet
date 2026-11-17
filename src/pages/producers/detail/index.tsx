import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

import { getProducerBySlug } from "../../../services/producers";
import CardSkeleton from "../../../components/ui/CardSkeleton";
import Image from "../../../components/ui/Image";
import ErrorState from "../../../components/ErrorState";
import NotFound from "../../../components/NotFound";

function ProducerSkeleton() {
  return (
    <main className="min-h-screen animate-pulse space-y-8 pb-12">
      <section className="space-y-5">
        <div className="h-3 w-52 rounded bg-neutral-800/50" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="size-24 shrink-0 rounded-2xl bg-neutral-800/50 sm:size-32" />

          <div className="flex-1 space-y-3">
            <div className="h-4 w-28 rounded bg-neutral-800/50" />
            <div className="h-8 w-52 max-w-full rounded bg-neutral-800/50" />
            <div className="h-3 w-32 rounded bg-neutral-800/50" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="h-5 w-32 rounded bg-neutral-800/50" />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border border-white/5 p-4"
            >
              <div className="h-4 w-24 rounded bg-neutral-800/50" />
              <div className="h-7 w-28 max-w-full rounded bg-neutral-800/50" />
              <div className="h-3 w-16 rounded bg-neutral-800/50" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="h-5 w-40 rounded bg-neutral-800/50" />
        <div className="h-3 w-full rounded bg-neutral-800/50" />
        <div className="h-3 w-11/12 rounded bg-neutral-800/50" />
        <div className="h-3 w-4/5 rounded bg-neutral-800/50" />
      </section>

      <section className="space-y-4">
        <div className="h-5 w-40 rounded bg-neutral-800/50" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  description,
  valueClassName = "text-white",
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  description?: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 space-y-3 border-r-2 border-primary-500/30 py-1 pr-3 sm:pr-4">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="size-4 shrink-0 text-primary-400" />
        <span className="truncate text-xs">{label}</span>
      </div>

      <p
        className={`break-words text-lg font-bold sm:text-xl ${valueClassName}`}
      >
        {value}
      </p>

      {description && (
        <p className="text-[10px] text-gray-500">{description}</p>
      )}
    </div>
  );
}

function Producer() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: producer,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["producer", slug],
    queryFn: () => getProducerBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) return <ProducerSkeleton />;

  if (isError) {
    return (
      <ErrorState
        retry={{
          label: "تلاش مجدد",
          fn: refetch,
          isLoading: isRefetching,
        }}
        title="دریافت اطلاعات با خطا مواجه شد"
        description={
          error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید."
        }
      />
    );
  }

  if (!producer) {
    return (
      <NotFound
        illustration={<BuildingOffice2Icon className="size-12 text-gray-500" />}
        backLabel="مشاهده تمام استودیوها"
        backTo="/producers"
        title="استودیو موردنظر پیدا نشد"
        description="ممکن است آدرس اشتباه باشد یا این استودیو حذف شده باشد."
      />
    );
  }

  const growthColor =
    producer.growth_rate === null
      ? "text-gray-400"
      : producer.growth_rate > 0
        ? "text-green-400"
        : producer.growth_rate < 0
          ? "text-red-400"
          : "text-white";

  return (
    <main className="min-h-screen space-y-9 pb-12 max-md:px-5 max-md:pt-5">
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="transition hover:text-white">
            خانه
          </Link>
          <span>/</span>
          <Link to="/producers" className="transition hover:text-white">
            ناشران و سازندگان
          </Link>
          <span>/</span>
          <span className="max-w-40 truncate text-gray-300 sm:max-w-none">
            {producer.name}
          </span>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="border-nabg-neutral-800/50 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-primary-500/50 sm:size-32">
            {producer.logo_path ? (
              <Image
                icon
                src={producer.logo_path}
                alt={producer.name}
                className="size-full object-contain"
              />
            ) : (
              <BuildingOffice2Icon className="size-12 text-gray-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-primary-500/20 bg-primary-500/10 px-2 py-1 text-[10px] text-primary-400">
                استودیو بازی‌سازی
              </span>

              <span className="font-Jaro text-base text-gray-500">
                <span className="font-Peyda text-sm">تأسیس</span>{" "}
                {producer.founded_year ?? "-"}
              </span>
            </div>

            <h1 className="break-words text-2xl font-bold text-white sm:text-3xl">
              {producer.name}
            </h1>

            {producer.website && (
              <a
                href={producer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs text-primary-400 transition hover:text-primary-300"
              >
                <GlobeAltIcon className="size-4" />
                وب‌سایت رسمی
                <ArrowTopRightOnSquareIcon className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="size-5 text-primary-400" />
          <h2 className="font-semibold text-white">اطلاعات و آمار</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-6">
          <StatItem
            icon={UsersIcon}
            label="تعداد کارکنان"
            value={producer.employees?.toLocaleString("fa-IR") ?? "-"}
            description="نفر"
          />

          <StatItem
            icon={CurrencyDollarIcon}
            label="درآمد سالانه"
            value={producer.revenue?.toLocaleString("fa-IR") ?? "-"}
            description={producer.revenue_currency ?? "واحد نامشخص"}
          />

          <StatItem
            icon={ArrowTrendingUpIcon}
            label="نرخ رشد"
            value={
              producer.growth_rate === null
                ? "-"
                : `${producer.growth_rate.toLocaleString("fa-IR")}%`
            }
            description="رشد سالانه"
            valueClassName={growthColor}
          />

          <StatItem
            icon={CalendarDaysIcon}
            label="سال تأسیس"
            value={producer.founded_year ?? "-"}
            description="سال شروع فعالیت"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="size-5 text-primary-400" />
          <h2 className="font-semibold text-white">درباره {producer.name}</h2>
        </div>

        {producer.description ? (
          <p className="whitespace-pre-line text-justify text-sm leading-8 text-gray-300">
            {producer.description}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            توضیحاتی برای این شرکت ثبت نشده است.
          </p>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PuzzlePieceIcon className="size-5 text-primary-400" />
            <h2 className="font-semibold text-white">بازی‌های توسعه‌یافته</h2>
          </div>

          <span className="text-xs text-gray-500">
            بازی‌های {producer.name}
          </span>
        </div>

        {/* Games list / grid */}
      </section>
    </main>
  );
}

export default Producer;
