"use client";

import { useId, useState } from "react";
import clsx from "clsx";

export type AccordionItem = { title: string; content: React.ReactNode };

type Props = {
  items: AccordionItem[];
  defaultOpen?: number | null; // índice abierto al cargar; ej. 0; null = ninguno
  className?: string;
};

export default function Accordion({
  items,
  defaultOpen = 0,
  className,
}: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <ul className={clsx("space-y-3", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={i} className="rounded-xl border border-gray-200 bg-white">
            <button
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="text-[15px] sm:text-base font-medium text-gray-900">
                {it.title}
              </span>
              <span
                aria-hidden
                className={clsx(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md font-bold text-gray-700",
                  isOpen ? "bg-gray-50" : "bg-white"
                )}
              >
                {isOpen ? (
                  // X
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="M6 6l12 12M18 6l-12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  // +
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
            </button>

            {/* Panel con transición usando grid-rows trick */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {it.content}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
