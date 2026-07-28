"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeCanvasProps {
  text?: string;
  path?: string;
  size?: number;
}

export function QRCodeCanvas({ text, path, size = 180 }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fullUrl, setFullUrl] = useState(text || "");

  useEffect(() => {
    let resolved = text || "";
    if (typeof window !== "undefined") {
      if (path) {
        resolved = `${window.location.origin}${path}`;
      } else if (text && text.startsWith("/")) {
        resolved = `${window.location.origin}${text}`;
      } else if (!text) {
        resolved = window.location.href;
      }
    }
    setFullUrl(resolved);
  }, [text, path]);

  useEffect(() => {
    if (canvasRef.current && fullUrl) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: size,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      }).catch((err) => console.error("QR Code Error:", err));
    }
  }, [fullUrl, size]);

  return <canvas ref={canvasRef} className="rounded-xl border border-slate-200 shadow-sm" />;
}
