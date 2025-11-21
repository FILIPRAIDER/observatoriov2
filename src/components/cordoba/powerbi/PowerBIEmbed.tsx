"use client";

interface PowerBIEmbedProps {
  embedUrl: string;
  title: string;
}

export default function PowerBIEmbed({ embedUrl, title }: PowerBIEmbedProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      {/* Contenedor con aspect ratio 16:9 */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          title={title}
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
