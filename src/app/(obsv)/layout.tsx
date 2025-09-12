import { Footer, Navbar } from "@/components";

export default function ObsvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden ">
      <Navbar />
      <div className="px-0">{children}</div>
      <Footer />
    </main>
  );
}
