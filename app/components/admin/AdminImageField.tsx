"use client";

import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import type { AdminUploadFolder } from "@/lib/admin-upload";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: AdminUploadFolder;
  required?: boolean;
  hint?: string;
};

type UploadResponse = { ok: boolean; data?: { url: string }; error?: string };

async function uploadFile(file: File, folder: AdminUploadFolder) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const json = (await response.json()) as UploadResponse;
  if (!response.ok || !json.ok || !json.data?.url) {
    throw new Error(json.error || "No se pudo subir la imagen");
  }
  return json.data.url;
}

export default function AdminImageField({
  label,
  value,
  onChange,
  folder,
  required = false,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      onChange(await uploadFile(file, folder));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-image-card space-y-3">
      <span className="admin-label">{label}</span>

      {value ? (
        <div className="admin-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vista previa" className="admin-upload-preview-img" />
          <button type="button" className="admin-small" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Cambiar imagen
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="admin-upload-zone"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 size={22} className="animate-spin text-gold" /> : <Upload size={22} className="text-gold" />}
          <span>{uploading ? "Subiendo…" : "Subir imagen desde tu PC"}</span>
          <span className="text-xs text-muted">JPG, PNG, WebP o GIF · máx. 5 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <label className="block text-sm">
        <span className="admin-label">O pegar URL</span>
        <input
          type="text"
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/productos/… o https://…"
          className="admin-input"
        />
      </label>

      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      {uploadError ? <p className="text-xs text-red-700">{uploadError}</p> : null}
    </div>
  );
}

type MultiProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: AdminUploadFolder;
};

export function AdminImageGalleryField({ label, value, onChange, folder }: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const urls = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setUploadError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file, folder));
      }
      const merged = [...urls, ...uploaded];
      onChange(merged.join("\n"));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeUrl(url: string) {
    onChange(urls.filter((item) => item !== url).join("\n"));
  }

  return (
    <div className="admin-image-card space-y-3">
      <span className="admin-label">{label}</span>

      {urls.length ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url) => (
            <div key={url} className="admin-upload-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-contain" />
              <button type="button" className="admin-upload-thumb-remove" onClick={() => removeUrl(url)} aria-label="Quitar">
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className="admin-upload-zone admin-upload-zone-compact"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-gold" /> : <ImagePlus size={18} className="text-gold" />}
        <span>{uploading ? "Subiendo…" : "Agregar imágenes"}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <label className="block text-sm">
        <span className="admin-label">URLs (una por línea)</span>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="admin-input" />
      </label>

      {uploadError ? <p className="text-xs text-red-700">{uploadError}</p> : null}
    </div>
  );
}
