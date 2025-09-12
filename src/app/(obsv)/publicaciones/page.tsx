export const revalidate = 0; // fuerza datos frescos en cada request

import { PublicationsSection } from "@/components";

export default function PublicacionesPage() {
  return (
    <>
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <PublicationsSection />
      </main>
    </>
  );
}
