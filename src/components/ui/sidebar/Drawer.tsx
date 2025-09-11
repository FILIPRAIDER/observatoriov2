"use client";

import { useEffect } from "react";
import clsx from "clsx";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  widthClass?: string; // ej. "w-80"
  topOffset?: number; // alto navbar en px
  children: React.ReactNode;
};

export default function Drawer({
  open,
  onClose,
  side = "right",
  widthClass = "w-80",
  topOffset = 0,
  children,
}: DrawerProps) {
  // Bloquear scroll vertical cuando está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const areaStyle: React.CSSProperties = {
    top: topOffset,
    height: `calc(100dvh - ${topOffset}px)`,
  };

  // NOTA: md:hidden => nunca visible en escritorio
  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        className={clsx(
          "fixed inset-x-0 z-30 bg-black/50 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={areaStyle}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={clsx(
          "fixed z-30 bg-white shadow-xl transition-transform will-change-transform md:hidden",
          widthClass,
          side === "right" ? "right-0" : "left-0",
          // Cuando está cerrado lo movemos un 110% para evitar el “pixel fantasma”
          open
            ? "translate-x-0"
            : side === "right"
            ? "translate-x-[110%]"
            : "-translate-x-[110%]"
        )}
        style={areaStyle}
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </aside>
    </>
  );
}
