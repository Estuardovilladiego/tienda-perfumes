import { redirect } from "next/navigation";

import AdminLoginForm from "@/app/components/admin/AdminLoginForm";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = { title: "Admin · Ingreso" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <PageBackLink href="/" label="Tienda" className="mb-6" />
        <div className="admin-card border-gold/20 shadow-[var(--admin-shadow-md)]">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Essenza</p>
          <h1 className="mt-3 text-2xl font-light tracking-[0.06em]">Panel administrador</h1>
          <p className="mt-2 text-sm text-muted">
            Ingresa con el correo y contraseña configurados para la tienda.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
