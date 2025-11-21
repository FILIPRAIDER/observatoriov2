"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/contact";

export default function ContactCta() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Enviando...");

    try {
      const result = await subscribeToNewsletter(name, email);
      
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message, {
          duration: 5000,
        });
        e.currentTarget.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Hubo un error al enviar tu información. Intenta nuevamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-8 sm:px-8 md:px-12 md:py-10">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            ¿Necesitas información para tomar decisiones en tu institución?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Nuestro equipo está listo para acompañarte con estudios,
            diagnósticos y asesoría especializada.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 max-w-5xl"
          noValidate
        >
          {/* grid 3 columnas; la 3ra más ancha para el botón */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-[1.5fr_1.5fr_1fr]">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-sm text-gray-600">
                Nombre
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                required
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gray-100/70 px-4 py-3 text-[15px] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Correo */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-sm text-gray-600">
                Correo
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gray-100/70 px-4 py-3 text-[15px] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Botón */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer inline-flex w-full items-center justify-center rounded-2xl bg-[#17594A] px-6 py-3.5 text-white font-semibold hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar solicitud"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
