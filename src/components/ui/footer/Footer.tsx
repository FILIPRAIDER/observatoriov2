import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* contenedor más angosto para que quede centrado */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 place-items-center text-center">
          {/* Col 1: solo logo + copyright */}
          <div>
            <Image
              src="/Logo.svg"
              alt="Observatorio de la Educación en Córdoba"
              width={160}
              height={48}
              className="h-12 w-auto"
              priority={false}
            />
            <p className="mt-3 text-xs text-gray-500">
              © {year} Observatorio de la educación. Todos los derechos
              reservados.
            </p>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <h3 className="font-semibold text-gray-900">Contacto</h3>
            <p className="mt-2 text-sm text-gray-700">
              <Link
                href="mailto:contacto@observatorio.com"
                className="hover:underline"
              >
                contacto@observatorio.com
              </Link>
            </p>
          </div>

          {/* Col 3: Ubicación */}
          <div>
            <h3 className="font-semibold text-gray-900">Ubicación</h3>
            <p className="mt-2 text-sm text-gray-700">
              Calle 52A No. 6-79, La Castellana
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
