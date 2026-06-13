import fs from "fs";
import path from "path";

import { getSiteUrl, site } from "@/lib/site";

/** PNG para correos — Gmail y la mayoría de clientes no muestran SVG. */
const LOGO_EMAIL_FILENAME = "logo-essenza.png";
export const LOGO_EMAIL_CID = "logo-essenza@essenza";

function logoEmailPath() {
  return path.join(process.cwd(), "public", LOGO_EMAIL_FILENAME);
}

function logoEmailDisponible() {
  try {
    return fs.existsSync(logoEmailPath());
  } catch {
    return false;
  }
}

/** URL pública del logo PNG (respaldo si no hay adjunto CID). */
export function logoEmailUrlPublica(): string | null {
  const siteUrl = getSiteUrl();
  if (!siteUrl || /localhost|127\.0\.0\.1/i.test(siteUrl)) return null;

  return `${siteUrl}/${LOGO_EMAIL_FILENAME}`;
}

function logoEmailFallbackHtml() {
  return `
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td align="center" valign="middle" width="80" height="80" style="width:80px;height:80px;background-color:#0a0a0a;border:2px solid #d4bc94;font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:600;color:#d4bc94;line-height:76px;text-align:center;border-radius:50%;">
                    E
                  </td>
                </tr>
              </table>`;
}

/** Logo en el encabezado del correo (CID embebido, URL PNG o fallback HTML). */
export function logoEmailHtml() {
  const imgStyle =
    'display:block;margin:0 auto 16px;width:80px;height:80px;border:0;border-radius:50%;';

  if (logoEmailDisponible()) {
    return `<img src="cid:${LOGO_EMAIL_CID}" alt="${site.nombreCompleto}" width="80" height="80" style="${imgStyle}" />`;
  }

  const url = logoEmailUrlPublica();
  if (url) {
    return `<img src="${url}" alt="${site.nombreCompleto}" width="80" height="80" style="${imgStyle}" />`;
  }

  return logoEmailFallbackHtml();
}

export function adjuntoLogoEmail() {
  if (!logoEmailDisponible()) return null;

  return {
    filename: LOGO_EMAIL_FILENAME,
    path: logoEmailPath(),
    cid: LOGO_EMAIL_CID,
  };
}

export function adjuntosLogoEmail() {
  const adjunto = adjuntoLogoEmail();
  return adjunto ? [adjunto] : [];
}
