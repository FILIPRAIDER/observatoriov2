// src/components/publications/PublicationCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Publication } from "@/app/actions/getFeaturedPublications";
import { formatISOShortUTC } from "@/lib/dates";

export default function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white transition hover:shadow-md">
      <Link href={`/publicaciones/${pub.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image
            src={pub.imageUrl}
            alt={pub.imageAlt ?? pub.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-2 text-sm sm:text-base font-medium text-gray-900">
            {pub.title}
          </h3>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <time dateTime={pub.publishedAt}>
              {formatISOShortUTC(pub.publishedAt)} {/* dd/mm/yyyy correcto */}
            </time>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px]">
              {pub.category}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
