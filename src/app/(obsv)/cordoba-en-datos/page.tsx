import { CordobaEnDatosSection } from "@/components";

// Deshabilitar generación estática
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CordobaEnDatosPage() {
  return (
    <>
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <CordobaEnDatosSection />
      </main>
    </>
  );
}
