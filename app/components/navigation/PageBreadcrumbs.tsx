import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function PageBreadcrumbs({ items, className = "" }: Props) {
  if (!items.length) return null;

  return (
    <nav aria-label="Ruta de navegación" className={`page-breadcrumbs ${className}`.trim()}>
      <ol className="page-breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="page-breadcrumbs-item">
              {item.href && !isLast ? (
                <Link href={item.href} className="page-breadcrumbs-link">
                  {item.label}
                </Link>
              ) : (
                <span className="page-breadcrumbs-current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
