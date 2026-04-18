import { Link } from "react-router-dom";

/**
 * CategoryTable Component
 * Renders admin table listing categories with edit and delete actions.
 * Props: { categories: Array, onDelete: Function }
 */
const CategoryTable = ({ categories = [], onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-panel border border-amber-200 bg-white/90">
      <table className="min-w-full text-sm">
        <thead className="bg-amber-50 text-left text-amber-900">
          <tr>
            <th className="px-4 py-3">Logo</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border-t border-amber-100">
              <td className="px-4 py-3">
                <img
                  src={category.logo || "https://placehold.co/100x100?text=Logo"}
                  alt={category.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-3 font-medium text-amber-900">{category.name}</td>
              <td className="px-4 py-3">{category.description || "-"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/categories/${category._id}/edit`}
                    className="rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 hover:border-brand-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
