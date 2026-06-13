import { requireAdminApi } from "@/lib/admin-auth";
import {
  ADMIN_UPLOAD_FOLDERS,
  type AdminUploadFolder,
  saveAdminImage,
} from "@/lib/admin-upload";

/** POST /api/admin/upload — multipart: file, folder (productos|categorias) */
export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ ok: false, error: "Archivo requerido" }, { status: 400 });
    }
    if (!ADMIN_UPLOAD_FOLDERS.includes(folder as AdminUploadFolder)) {
      return Response.json({ ok: false, error: "Carpeta inválida" }, { status: 400 });
    }

    const url = await saveAdminImage(file, folder as AdminUploadFolder);
    return Response.json({ ok: true, data: { url } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir la imagen";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
