/**
 * OrderCard Component
 * Renders one past order card with line items and re-order action.
 * Props: { order: Object, onReorder?: Function }
 */
const OrderCard = ({ order, onReorder }) => {
  return (
    <article className="glass-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-amber-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          {order.status}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-amber-900">
        {order.items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
            <span>
              {item.title} x {item.quantity}
            </span>
            <span className="font-semibold">Rs. {(item.priceAtOrder * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-extrabold text-brand-700">Total: Rs. {Number(order.totalAmount).toFixed(2)}</p>
        {onReorder && (
          <button
            onClick={() => onReorder(order)}
            className="rounded-full border border-brand-500 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Re-order
          </button>
        )}
      </div>
    </article>
  );
};

export default OrderCard;
