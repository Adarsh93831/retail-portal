import { Link } from "react-router-dom";

/**
 * ProductTable Component
 * Renders admin table listing products with edit and delete actions.
 * Props: { products: Array, onDelete: Function }
 */
const ProductTable = ({ products = [], onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-panel border border-amber-200 bg-white/90">
      <table className="min-w-full text-sm">
        <thead className="bg-amber-50 text-left text-amber-900">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Cost</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t border-amber-100">
              <td className="px-4 py-3 font-medium text-amber-900">{product.title}</td>
              <td className="px-4 py-3">{product.category?.name || "-"}</td>
              <td className="px-4 py-3">Rs. {Number(product.cost).toFixed(2)}</td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 hover:border-brand-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(product._id)}
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

export default ProductTable;
