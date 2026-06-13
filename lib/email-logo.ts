import { getSiteUrl, site } from "@/lib/site";

const LOGO_FALLBACK = "logo-essenza.png";

/** URL pública del logo (producción). Gmail la muestra mejor que CID vía SMTP. */
export function logoEmailUrlPublica(): string | null {
  const siteUrl = getSiteUrl();
  if (!siteUrl || /localhost|127\.0\.0\.1/i.test(siteUrl)) return null;

  const filename = site.logo.replace(/^\//, "") || LOGO_FALLBACK;
  return `${siteUrl}/${filename}`;
}

/** Logo en el encabezado del correo (HTML en local, PNG por URL en producción). */
export function logoEmailHtml() {
  const url = logoEmailUrlPublica();

  if (url) {
    return `<img src="${url}" alt="${site.nombreCompleto}" width="80" height="80" style="display:block;margin:0 auto 16px;width:80px;height:80px;border:0;border-radius:50%;" />`;
  }

  return `
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td align="center" valign="middle" width="80" height="80" style="width:80px;height:80px;background-color:#0a0a0a;border:2px solid #d4bc94;font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:600;color:#d4bc94;line-height:76px;text-align:center;border-radius:50%;">
                    E
                  </td>
                </tr>
              </table>`;
}

export function adjuntoLogoEmail() {
  return null;
}

export function adjuntosLogoEmail() {
  return [];
}
