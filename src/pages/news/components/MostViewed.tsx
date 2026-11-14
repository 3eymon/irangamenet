import { Link } from "react-router-dom";
import { PopularCard } from "./HeaderNews";
import ReactTimeAgo from "react-time-ago";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { News } from "../../../services/news/queries";
import Image from "../../../components/ui/Image";
import { extractAuthorName } from "../../../utils/extractAuthorName";

export default function MostViewed({ news }: { news: News[] }) {
  const topview = news[0];
  return (
    <div className="flex w-full flex-col px-5 lg:flex-row">
      <div className="w-full">
        {topview ? (
          <div key={topview.id} className="w-full">
            <Link to={String(topview.id)}>
              <Image
                src={topview.cover_path}
                className="h-60 w-full rounded-xl bg-gray-400 object-cover transition-all ease-linear hover:brightness-[.8]"
                alt={`خبر ${topview.title} `}
              />
            </Link>
            <div className="flex flex-col gap-1 pt-3">
              <div className="inline-flex items-center gap-2 pr-1 text-sm">
                <div className="inline-flex items-center gap-1">
                  <Image
                    src={topview.author.avatar_path}
                    className="h-7 w-7 rounded-full object-cover"
                    alt={`${extractAuthorName(topview)} نویسنده خبر `}
                  />
                  <p>{extractAuthorName(topview)}</p>
                </div>
                <p className="text-gray-400">
                  <ReactTimeAgo
                    date={new Date(topview.published_at || topview.created_at)}
                    locale="fa-IR"
                    timeStyle="round"
                  />
                </p>
              </div>
              <h2 className="w-11/12 font-PeydaMed text-lg">
                <Link to={String(topview.id)}>{topview.title}</Link>
              </h2>
              <p className="line-clamp-3 text-xs text-gray-300">
                {topview.excerpt}
              </p>
              <div className="pt-2">
                <p className="inline-flex items-center gap-1 text-xs text-gray-400">
                  {topview.categories.map((category) => {
                    return (
                      <Link
                        key={category.slug}
                        to={`/news/category/${category.slug}`}
                        className="pl-2 text-red-500"
                      >
                        {category.title}
                      </Link>
                    );
                  })}
                  <BookOpenIcon className="w-4" />
                  {topview.views.toLocaleString()} نفر خوندن
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <span className="my-5 h-0.5 w-full rounded-full bg-gray-400 lg:hidden"></span>
      <div className="w-full">
        {news.map((item, index) =>
          index > 0 && index <= 3 ? (
            <PopularCard key={item.id} data={item} />
          ) : null,
        )}
      </div>
    </div>
  );
}
