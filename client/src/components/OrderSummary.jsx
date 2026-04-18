/**
 * OrderSummary Component
 * Displays subtotal, tax, and final total for cart or checkout views.
 * Props: { subtotal: Number, tax: Number, total: Number }
 */
const OrderSummary = ({ subtotal, tax, total }) => {
  return (
    <aside className="glass-panel p-4">
      <h3 className="text-lg font-bold text-amber-900">Order Summary</h3>
      <div className="mt-3 space-y-2 text-sm text-amber-900">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estimated Tax</span>
          <span>Rs. {tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-amber-200 pt-2 text-base font-extrabold text-brand-700">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
