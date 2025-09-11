export default function ObsvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden ">
      <div className="px-0">{children}</div>
    </main>
  );
}
