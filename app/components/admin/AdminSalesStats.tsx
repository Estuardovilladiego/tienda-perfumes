"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSectionHeader, AdminTableWrap } from "@/app/components/admin/AdminUi";

type MonthlyStats = {
  month: number;
  year: number;
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  bestSeller: { name: string; units: number };
  dailySales: { day: number; label: string; sales: number }[];
  topProducts: { name: string; units: number; revenue: number }[];
};

type ApiResult<T> = { ok: boolean; data?: T; error?: string };

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function money(value: number) {
  return `$${Number(value || 0).toLocaleString("es-CO")}`;
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return money(value);
}

async function fetchMonthlyStats(month: number, year: number): Promise<MonthlyStats> {
  const params = new URLSearchParams({ month: String(month), year: String(year) });
  const response = await fetch(`/api/admin/stats/monthly?${params}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  const json = (await response.json().catch(() => ({ ok: false, error: "Respuesta inválida" }))) as ApiResult<MonthlyStats>;
  if (!response.ok || !json.ok || !json.data) {
    throw new Error(json.error || "No se pudieron cargar las estadísticas");
  }
  return json.data;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="admin-stats-tooltip">
      <p className="admin-stats-tooltip-label">Día {label}</p>
      <p className="admin-stats-tooltip-value">{money(Number(payload[0]?.value ?? 0))}</p>
    </div>
  );
}

export default function AdminSalesStats() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchMonthlyStats(month, year)
      .then((data) => {
        if (!active) return;
        setStats(data);
        setError("");
      })
      .catch((e) => {
        if (!active) return;
        setStats(null);
        setError(e instanceof Error ? e.message : "Error al cargar estadísticas");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      setLoading(true);
    };
  }, [month, year]);

  function shiftMonth(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
  }

  const periodLabel = useMemo(() => `${MONTHS[month - 1]} ${year}`, [month, year]);

  const kpiCards = stats
    ? [
        { label: "Ventas Totales", value: money(stats.totalSales), hint: periodLabel },
        { label: "Pedidos", value: String(stats.totalOrders), hint: "Confirmados o superiores" },
        { label: "Ticket Promedio", value: money(stats.averageTicket), hint: "Por pedido" },
        {
          label: "Perfume Top",
          value: stats.bestSeller.units > 0 ? stats.bestSeller.name : "—",
          hint: stats.bestSeller.units > 0 ? `${stats.bestSeller.units} unidades` : "Sin ventas",
          compact: stats.bestSeller.name.length > 22,
        },
      ]
    : [];

  return (
    <div className="admin-form-stack admin-stats-panel">
      <div className="admin-card admin-stats-toolbar">
        <AdminSectionHeader
          title="Estadísticas de Ventas"
          subtitle="Análisis mensual de pedidos confirmados (excluye pendientes y cancelados)"
        />
        <div className="admin-stats-period">
          <button
            type="button"
            className="admin-btn admin-btn-soft admin-stats-nav"
            onClick={() => shiftMonth(-1)}
            disabled={loading}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="admin-stats-selectors">
            <label className="admin-stats-selector">
              <CalendarDays size={15} aria-hidden />
              <span className="sr-only">Mes</span>
              <select
                className="admin-input admin-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={loading}
                aria-label="Seleccionar mes"
              >
                {MONTHS.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-stats-selector">
              <span className="sr-only">Año</span>
              <select
                className="admin-input admin-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={loading}
                aria-label="Seleccionar año"
              >
                {Array.from({ length: 6 }, (_, i) => now.getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-soft admin-stats-nav"
            onClick={() => shiftMonth(1)}
            disabled={loading || (year === now.getFullYear() && month === now.getMonth() + 1)}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-card admin-stats-loading" aria-live="polite">
          <Loader2 size={22} className="animate-spin text-gold" />
          <p>Cargando estadísticas de {periodLabel}…</p>
        </div>
      ) : stats ? (
        <>
          <div className="admin-stat-grid admin-stat-grid-4">
            {kpiCards.map((card) => (
              <div key={card.label} className="admin-stat-card admin-stats-kpi">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{card.label}</p>
                <p className={card.compact ? "admin-stats-kpi-value-compact" : undefined}>{card.value}</p>
                <p className="admin-stats-kpi-hint">{card.hint}</p>
              </div>
            ))}
          </div>

          <div className="admin-card admin-stats-chart-card">
            <AdminSectionHeader
              title="Ventas por día"
              subtitle={`Distribución diaria · ${periodLabel}`}
            />
            {stats.dailySales.some((d) => d.sales > 0) ? (
              <div className="admin-stats-chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={stats.dailySales} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="admin-stats-grid" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={formatCompact}
                      tickLine={false}
                      axisLine={false}
                      width={56}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(184, 149, 108, 0.08)" }} />
                    <Bar
                      dataKey="sales"
                      fill="var(--gold)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={42}
                      animationDuration={600}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="admin-empty-state">No hubo ventas registradas en este periodo.</p>
            )}
          </div>

          <div className="admin-card admin-card-flush">
            <AdminSectionHeader
              title="Top 5 perfumes"
              subtitle="Ranking por unidades vendidas"
            />
            {stats.topProducts.length ? (
              <AdminTableWrap minWidth={560}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Unidades Vendidas</th>
                      <th>Ingresos Generados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, index) => (
                      <tr key={`${product.name}-${index}`}>
                        <td className="text-muted">{index + 1}</td>
                        <td className="font-medium">{product.name}</td>
                        <td>
                          <span className="admin-badge admin-badge-green">{product.units}</span>
                        </td>
                        <td>{money(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminTableWrap>
            ) : (
              <p className="admin-empty-state">Sin productos vendidos en este mes.</p>
            )}
          </div>
        </>
      ) : null}

      {!loading && !stats && !error ? (
        <div className="admin-card admin-stats-empty">
          <TrendingUp size={28} className="text-gold" aria-hidden />
          <p>Selecciona un periodo para ver las estadísticas.</p>
        </div>
      ) : null}
    </div>
  );
}
