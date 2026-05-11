// components/ImageUploader.tsx
"use client";

import { AttachFile, Clear, Upload } from "@mui/icons-material";
import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
    onFileChange?: (file: File | null) => void;
}

const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function ImageUploader({ onFileChange }: ImageUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function validate(f: File): string | null {
        if (!f.type.startsWith("image/")) return "Only images can be uploaded.";
        if (f.size > MAX_SIZE_BYTES) return `File size exceeds ${MAX_SIZE_MB} MB.`;
        return null;
    }

    function handleSelect(f: File) {
        const err = validate(f);
        if (err) {
            setError(err);
            setFile(null);
            onFileChange?.(null);
            return;
        }
        setError(null);
        setFile(f);
        onFileChange?.(f);
    }

    function handleClear() {
        setFile(null);
        setError(null);
        onFileChange?.(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (f) handleSelect(f);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleSelect(f);
    }

    const sizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null;

    return (
        <div className="uploader">
            {!file && (
                <div
                    className={`drop-zone ${isDragging ? "dragging" : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                    aria-label="Kép feltöltése"
                >
                    <Upload />
                    <p className="drop-zone__primary">Drag your image</p>
                    <p className="drop-zone__secondary">
                        vagy <span className="drop-zone__link">browse</span>
                    </p>
                    <p className="drop-zone__hint">JPG, PNG, WEBP — max {MAX_SIZE_MB} MB</p>
                </div>
            )}

            {file && (
                <div className="file-row">
                    <AttachFile />
                    <div className="file-row__info">
                        <span className="file-row__name">{file.name}</span>
                        <span className="file-row__size">{sizeMB} MB</span>
                    </div>
                    <button
                        className="file-row__clear"
                        onClick={handleClear}
                        aria-label="Fájl törlése"
                        type="button"
                    >
                        <Clear />
                    </button>
                </div>
            )}

            {error && <p className="uploader__error">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleInputChange}
            />

            <style>{`
        .uploader {
          width: 100%;
          max-width: 480px;
          font-family: sans-serif;
        }

        /* --- Drop zone --- */
        .drop-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          transition: border-color 0.15s, background 0.15s;
          outline: none;
        }

        .drop-zone:hover,
        .drop-zone:focus,
        .drop-zone.dragging {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .drop-zone__primary {
          margin: 0.5rem 0 0.25rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
        }

        .drop-zone__secondary {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .drop-zone__link {
          color: #3b82f6;
          text-decoration: underline;
        }

        .drop-zone__hint {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        /* --- Fájl sor --- */
        .file-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
        }

        .file-row__info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .file-row__name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-row__size {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .file-row__clear {
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
        }

        .file-row__clear:hover {
          color: #ef4444;
          background: #fef2f2;
        }

        /* --- Hiba --- */
        .uploader__error {
          margin-top: 0.5rem;
          font-size: 0.82rem;
          color: #ef4444;
        }
      `}</style>
        </div>
    );
}