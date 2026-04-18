import { useState } from "react";

/**
 * OrderRow Component
 * Renders one admin order row with status update dropdown.
 * Props: { order: Object, onStatusChange: Function }
 */
const OrderRow = ({ order, onStatusChange }) => {
  const [status, setStatus] = useState(order.status);

  return (
    <tr className="border-t border-amber-100">
      <td className="px-4 py-3 font-medium text-amber-900">{order._id.slice(-6).toUpperCase()}</td>
      <td className="px-4 py-3">{order.user?.name || "-"}</td>
      <td className="px-4 py-3">Rs. {Number(order.totalAmount).toFixed(2)}</td>
      <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-amber-300 px-2 py-1"
        >
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onStatusChange(order._id, status)}
          className="rounded-full border border-brand-500 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
