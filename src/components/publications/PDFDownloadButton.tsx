// src/components/publications/PDFDownloadButton.tsx
"use client";

import { formatBytes } from "@/lib/formatBytes";

interface PDFDownloadButtonProps {
  pdfUrl: string;
  pdfName?: string;
  pdfSize?: number;
  variant?: "default" | "compact" | "card";
}

export default function PDFDownloadButton({
  pdfUrl,
  pdfName = "documento.pdf",
  pdfSize,
  variant = "default",
}: PDFDownloadButtonProps) {
  if (variant === "compact") {
    return (
      <a
        href={pdfUrl}
        download={pdfName}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-600 hover:text-red-700 transition-colors"
        aria-label={`Descargar PDF: ${pdfName}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3v12m0 0l-4-4m4 4l4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>PDF</span>
        {pdfSize && (
          <span className="text-neutral-500">({formatBytes(pdfSize)})</span>
        )}
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href={pdfUrl}
        download={pdfName}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-xl border-2 border-dashed border-red-200 bg-red-50/50 p-6 hover:border-red-300 hover:bg-red-50 transition-all"
        aria-label={`Descargar PDF: ${pdfName}`}
      >
        <div className="flex items-start gap-4">
          {/* PDF Icon */}
          <div className="shrink-0 rounded-lg bg-red-100 p-3 group-hover:bg-red-200 transition-colors">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-600"
              aria-hidden="true"
            >
              <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2v6h6M12 18v-6m0 0l-2 2m2-2l2 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">
              Descargar documento PDF
            </h3>
            <p className="text-[13px] text-neutral-600 truncate">{pdfName}</p>
            {pdfSize && (
              <p className="mt-1 text-[12px] text-neutral-500">
                Tamaño: {formatBytes(pdfSize)}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-neutral-400 group-hover:text-red-600 transition-colors"
              aria-hidden="true"
            >
              <path
                d="M7 17L17 7m0 0H7m10 0v10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </a>
    );
  }

  // Default variant
  return (
    <a
      href={pdfUrl}
      download={pdfName}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
      aria-label={`Descargar PDF: ${pdfName}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3v12m0 0l-4-4m4 4l4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Descargar PDF</span>
      {pdfSize && (
        <span className="text-red-200">({formatBytes(pdfSize)})</span>
      )}
    </a>
  );
}
