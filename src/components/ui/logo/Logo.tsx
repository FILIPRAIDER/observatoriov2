import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/Logo.svg"
        alt="Observatorio de la Educación en Córdoba"
        width={200}
        height={60}
      />
    </Link>
  );
};
