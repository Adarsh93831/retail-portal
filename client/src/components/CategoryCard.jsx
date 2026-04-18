import { Link } from "react-router-dom";

/**
 * CategoryCard Component
 * Renders category preview card with logo, name, and quick navigation link.
 * Props: { category: Object }
 */
const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category._id}`}
      className="glass-panel group block overflow-hidden border border-transparent p-4 transition hover:border-brand-400"
    >
      <div className="flex items-center gap-3">
        <img
          src={category.logo || "https://placehold.co/120x120?text=Category"}
          alt={category.name}
          className="h-14 w-14 rounded-full border border-amber-200 object-cover"
        />
        <div>
          <h4 className="font-bold text-amber-900 group-hover:text-brand-700">{category.name}</h4>
          <p className="text-xs text-amber-800/80">{category.description || "Explore products"}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
