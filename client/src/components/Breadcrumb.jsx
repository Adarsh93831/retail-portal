import { Link } from "react-router-dom";

/**
 * Breadcrumb Component
 * Renders page navigation trail for category and product detail pages.
 * Props: { items: Array<{ label: String, to?: String }> }
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="mb-4 text-sm text-amber-800/80" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="font-medium hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-amber-900">{item.label}</span>
              )}
              {!isLast && <span>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
