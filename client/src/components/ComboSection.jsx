import { Link } from "react-router-dom";

/**
 * ComboSection Component
 * Shows optional combo product suggestions for selected product.
 * Props: { combos: Array }
 */
const ComboSection = ({ combos = [] }) => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-bold text-amber-900">Combo Suggestions</h3>
      <div className="mt-3 space-y-3">
        {combos.length === 0 && <p className="text-sm text-amber-800/80">No combo offers available.</p>}

        {combos.map((combo, index) => {
          if (!combo.product) {
            return null;
          }

          return (
            <Link
              key={`${combo.product._id}-${index}`}
              to={`/product/${combo.product._id}`}
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-white/70 px-3 py-2 hover:border-brand-400"
            >
              <span className="font-medium text-amber-900">{combo.product.title}</span>
              <span className="text-sm font-semibold text-brand-700">{combo.discountPercent || 0}% OFF</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ComboSection;
