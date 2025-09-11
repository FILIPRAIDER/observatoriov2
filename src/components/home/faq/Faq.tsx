import Accordion from "@/components/ui/Accordion/Accordion";
import { FAQ_ITEMS } from "@/lib/faq";

export default function FaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[660px]">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">FAQ</h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Preguntas frecuentes
        </p>
      </div>

      <div className="mt-6">
        <Accordion
          items={FAQ_ITEMS.map((i) => ({ title: i.title, content: i.content }))}
          defaultOpen={null} // todos cerrados al iniciar
          className="space-y-4" // un poco más de aire
        />
      </div>
    </section>
  );
}
