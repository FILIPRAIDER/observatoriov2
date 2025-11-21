"use client";

interface PowerBIEmbedProps {
  embedUrl: string;
  title: string;
}

export default function PowerBIEmbed({ embedUrl, title }: PowerBIEmbedProps) {
  // Asegurar que la URL tenga parámetros para modo público
  const publicUrl = embedUrl.includes('?') 
    ? `${embedUrl}&filterPaneEnabled=false&navContentPaneEnabled=true`
    : `${embedUrl}?filterPaneEnabled=false&navContentPaneEnabled=true`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-300 shadow-inner">
      {/* Contenedor con aspect ratio 16:9 y altura mínima en mobile */}
      <div className="relative w-full bg-neutral-50" style={{ paddingBottom: "56.25%", minHeight: "400px" }}>
        <iframe
          title={title}
          src={publicUrl}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
