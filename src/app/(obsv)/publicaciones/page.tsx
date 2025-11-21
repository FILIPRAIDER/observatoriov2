export const dynamic = 'force-dynamic';
export const revalidate = 0; // fuerza datos frescos en cada request

import { PublicationsSection } from "@/components";
import { fetchPublicationTypes } from "@/app/actions/publications";

export default async function PublicacionesPage() {
  const types = await fetchPublicationTypes();

  return (
    <>
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <PublicationsSection initialTypes={types} />
      </main>
    </>
  );
}
