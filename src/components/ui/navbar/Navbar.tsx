"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../logo/Logo";
import Drawer from "../sidebar/Drawer";

const links = [
  { href: "/datos", label: "Córdoba en datos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/publicaciones", label: "Publicaciones" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [navH, setNavH] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Medir la altura real de la navbar (responsive)
  const measure = () => {
    const h = headerRef.current?.offsetHeight ?? 0;
    setNavH(h);
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cerrar drawer cuando cambie la ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200"
    >
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <Logo />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-700 hover:text-black"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="#Contactanos"
            className="inline-flex items-center rounded-full bg-[#17594A] border border-gray-300 px-4 py-2 text-sm font-medium  text-white transition"
          >
            Contáctanos
          </Link>
        </div>

        {/* Mobile: botón hamburguesa que cambia a X */}
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-controls="mobile-drawer"
          aria-expanded={open}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            // Icono X
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Icono hamburguesa
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Drawer móvil - aparece debajo de la navbar */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        widthClass="w-80"
        topOffset={navH}
      >
        <div id="mobile-drawer" className="flex h-full flex-col">
          <div className="flex-1 px-4 py-2">
            <ul className="space-y-2 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base text-gray-800 hover:bg-gray-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 pb-6">
            <Link
              href="#Contactanos"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full border px-4 py-3 text-center font-medium hover:bg-black hover:text-white transition"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
