import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const ADMIN_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const ADMIN_UPLOAD_FOLDERS = ["productos", "categorias"] as const;

export type AdminUploadFolder = (typeof ADMIN_UPLOAD_FOLDERS)[number];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function validarArchivoImagen(file: File) {
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WebP o GIF.");
  }
  if (file.size > ADMIN_UPLOAD_MAX_BYTES) {
    throw new Error("La imagen no puede superar 5 MB.");
  }
  return ext;
}

function cloudinaryConfigurado() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ?? "";

  if (!cloudName || !uploadPreset) return false;
  if (/^tu_cloud_name$/i.test(cloudName) || cloudName.includes("example")) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME sigue siendo un placeholder. Copia el Cloud name real desde Cloudinary → Dashboard."
    );
  }

  return true;
}

function firmaCloudinary(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

async function saveAdminImageCloudinary(file: File, folder: AdminUploadFolder) {
  validarArchivoImagen(file);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const folderPath = `essenza/${folder}`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folderPath);

  // Preset "Signed" o error "Unknown API key" → firmar con API Key + Secret (Dashboard).
  if (apiKey && apiSecret) {
    const timestamp = String(Math.round(Date.now() / 1000));
    const paramsToSign: Record<string, string> = {
      folder: folderPath,
      timestamp,
      upload_preset: uploadPreset,
    };
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", firmaCloudinary(paramsToSign, apiSecret));
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  const payload = (await response.json().catch(() => null)) as
    | { secure_url?: string; error?: { message?: string } }
    | null;

  if (!response.ok || !payload?.secure_url) {
    const detail = payload?.error?.message ?? `HTTP ${response.status}`;
    if (/unknown api key/i.test(detail)) {
      throw new Error(
        `Cloudinary: API key o Cloud name incorrectos. Revisa CLOUDINARY_CLOUD_NAME y CLOUDINARY_API_KEY en .env (Dashboard → Account Details). Detalle: ${detail}`
      );
    }
    throw new Error(`No se pudo subir a Cloudinary: ${detail}`);
  }

  return payload.secure_url;
}

async function saveAdminImageLocal(file: File, folder: AdminUploadFolder) {
  const ext = validarArchivoImagen(file);
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${filename}`;
}

export async function saveAdminImage(file: File, folder: AdminUploadFolder) {
  if (cloudinaryConfigurado()) {
    return saveAdminImageCloudinary(file, folder);
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en Vercel para subir imágenes."
    );
  }

  return saveAdminImageLocal(file, folder);
}
