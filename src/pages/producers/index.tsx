import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { getAllProducers } from "../../services/producers";
import ErrorState from "../../components/ErrorState";
import Image from "../../components/ui/Image";
import EmptyState from "../../components/EmptyState";

function Producers() {
  const {
    data: producers,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["producers"],
    queryFn: () => getAllProducers({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isError) {
    return (
      <ErrorState
        retry={{
          label: "تلاش مجدد",
          fn: refetch,
          isLoading: isRefetching,
        }}

        title="دریافت اطلاعات سازندگان با خطا مواجه شد."
      />
    );
  }
  if (!isLoading && producers && producers?.length <= 0) {
    return <EmptyState title=" هنوز سازنده‌ای ثبت نشده است." description="" />;
  }
  return (
    <main className="space-y-6 pb-12 max-md:pt-5">
      <div className="flex items-center justify-between max-md:px-5">
        <div>
          <h1 className="text-xl font-bold text-white">سازندگان بازی</h1>
          <p className="mt-1 text-xs text-gray-400">
            استودیوها و شرکت‌های بازی‌سازی
          </p>
        </div>

        <p className="text-xs text-gray-500 flex items-center">
          سازنده
          {isLoading ? <span className="size-3 rounded-sm bg-neutral-800/50 animate-pulse mx-1"></span> : <span className="px-1">{(producers?.length ?? 0)}</span>}
        </p>
      </div>

      <div className="divide-y divide-white/5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <div className="size-12 rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/10" />
                </div>
              </div>
            ))
          : producers?.map((producer) => (
              <Link
                key={producer.id}
                to={`/producers/${producer.slug}`}
                className="group flex min-w-0 items-center gap-3 px-6 py-4 transition hover:bg-white/[0.02] sm:gap-4 sm:px-3"
              >
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 transition group-hover:border-primary-500/40 sm:size-14">
                  {producer.logo_path ? (
                    <Image
                      icon
                      src={producer.logo_path}
                      alt={producer.name}
                      className="size-full object-contain"
                    />
                  ) : (
                    <BuildingOffice2Icon className="size-7 text-gray-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-gray-200 transition group-hover:text-primary-400">
                    {producer.name}
                  </h2>

                  <p className="mt-1 text-[11px] text-gray-500">
                    تأسیس {producer.founded_year ?? "-"}
                  </p>
                </div>

                <div className="hidden flex-col items-end gap-1 text-[11px] sm:flex">
                  <span className="text-gray-300">
                    {producer.employees?.toLocaleString("fa-IR") ?? "-"} کارکنان
                  </span>
                  <span className="text-gray-500">
                    {producer.revenue !== null
                      ? `${producer.revenue.toLocaleString("fa-IR")} ${producer.revenue_currency ?? ""}`
                      : "درآمد نامشخص"}
                  </span>
                </div>

                <span
                  className={`hidden text-xs font-medium sm:block ${
                    producer.growth_rate === null
                      ? "text-gray-500"
                      : producer.growth_rate > 0
                        ? "text-green-400"
                        : producer.growth_rate < 0
                          ? "text-red-400"
                          : "text-gray-400"
                  }`}
                  dir="ltr"
                >
                  {producer.growth_rate === null
                    ? "-"
                    : `${producer.growth_rate > 0 ? "+" : ""}${producer.growth_rate}%`}
                </span>

                <span className="text-gray-600 transition group-hover:text-primary-400">
                  ←
                </span>
              </Link>
            ))}
      </div>
    </main>
  );
}

export default Producers;
