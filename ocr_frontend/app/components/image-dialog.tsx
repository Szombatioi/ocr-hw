"use client";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useRef, useEffect, useCallback } from "react";
import { Image } from "@/types/image";
import { OcrResult } from "@/types/ocr-result";

interface Props {
  image: Image | null;
  onClose: () => void;
}

function hasText(ocrResult: OcrResult): boolean {
  return ocrResult.ParsedResults?.some((r) => r.ParsedText?.trim().length > 0) ?? false;
}

export default function ImageDialog({ image, onClose }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawRects = useCallback((ocrResult: OcrResult) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    canvas.width = displayW;
    canvas.height = displayH;
    canvas.style.width = displayW + "px";
    canvas.style.height = displayH + "px";

    const scaleX = displayW / img.naturalWidth;
    const scaleY = displayH / img.naturalHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, displayW, displayH);
    ctx.strokeStyle = "rgba(246, 72, 59, 0.85)";
    ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
    ctx.lineWidth = 3;
    const padding = 4;
    
    //Loop through OCRSpace results
    for (const parsed of ocrResult.ParsedResults ?? []) {
      for (const line of parsed.TextOverlay?.Lines ?? []) {
        for (const word of line.Words ?? []) {
          const x = word.Left * scaleX - padding;
          const y = word.Top * scaleY - padding;
          const w = word.Width * scaleX + 2 * padding;
          const h = word.Height * scaleY + 2 * padding;
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        }
      }
    }
  }, []);

  // Redraw when image or ocrResult changes
  useEffect(() => {
    if (image?.ocrResult) {
      const img = imgRef.current;
      if (img?.complete && img.naturalWidth > 0) {
        requestAnimationFrame(() => drawRects(image.ocrResult!));
      }
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [image, drawRects]);

  function handleImageLoad() {
    if (image?.ocrResult) {
      requestAnimationFrame(() => drawRects(image.ocrResult!));
    }
  }

  return (
    <Dialog open={!!image} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {image?.name}
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {image?.ocrResult && !hasText(image.ocrResult) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No text was found in this image.
          </Alert>
        )}
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <img
            ref={imgRef}
            src={image?.url}
            alt={image?.name}
            onLoad={handleImageLoad}
            style={{ display: "block", width: "100%", borderRadius: 4 }}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          />
        </div>

      </DialogContent>
    </Dialog>
  );
}
