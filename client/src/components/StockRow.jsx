import { useState } from "react";

/**
 * StockRow Component
 * Renders one product row for inline stock update in admin stock manager.
 * Props: { product: Object, onSave: Function }
 */
const StockRow = ({ product, onSave }) => {
  const [newStock, setNewStock] = useState(product.stock);
  const [reason, setReason] = useState("Manual update");

  return (
    <tr className="border-t border-amber-100">
      <td className="px-4 py-3 font-medium text-amber-900">{product.title}</td>
      <td className="px-4 py-3">{product.stock}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          value={newStock}
          onChange={(event) => setNewStock(event.target.value)}
          className="w-24 rounded-lg border border-amber-300 px-2 py-1"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="w-56 rounded-lg border border-amber-300 px-2 py-1"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onSave(product._id, Number(newStock), reason)}
          className="rounded-full border border-brand-500 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
        >
          Save
        </button>
      </td>
    </tr>
  );
};

export default StockRow;
