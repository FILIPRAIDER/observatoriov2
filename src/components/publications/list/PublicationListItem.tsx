"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";

export type Publication = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // ej: "5/08/2025"
  img: string;
  alt: string;
};

export default function PublicationListItem({
  title,
  excerpt,
  tag,
  date,
  img,
  alt,
}: Publication) {
  const slug = slugify(title);

  return (
    <Link href={`/publicaciones/${slug}`} className="block">
      <article className="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {/* Imagen */}
          <div className="relative w-full sm:w-[288px] h-[156px] sm:h-[168px] overflow-hidden rounded-xl">
            <Image
              src={img}
              alt={alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw"
              priority={false}
            />
          </div>

          {/* Texto */}
          <div className="flex-1">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-neutral-900 leading-snug underline-offset-2 group-hover:underline">
              {title}
            </h3>

            <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
              {excerpt}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-[12px] font-medium text-white">
                {tag}
              </span>

              <span className="text-[12px] text-neutral-500">{date}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
