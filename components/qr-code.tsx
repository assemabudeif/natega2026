"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCanvasProps {
  text: string;
  size?: number;
}

export function QRCodeCanvas({ text, size = 180 }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      }).catch((err) => console.error("QR Code Error:", err));
    }
  }, [text, size]);

  return <canvas ref={canvasRef} className="rounded-xl border border-slate-200 shadow-sm" />;
}
