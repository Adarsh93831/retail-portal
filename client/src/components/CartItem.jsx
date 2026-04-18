import { Minus, Plus, Trash2 } from "lucide-react";

/**
 * CartItem Component
 * Renders one cart line item with quantity controls and remove action.
 * Props: { item: Object, onUpdateQuantity: Function, onRemove: Function }
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const addOnTotal = (item.selectedAddOns || []).reduce((sum, addOn) => {
    return sum + Number(addOn.price || 0);
  }, 0);

  const lineTotal = (Number(item.product.cost) + addOnTotal) * item.quantity;

  return (
    <div className="glass-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img
          src={item.product.image || "https://placehold.co/120x120?text=Item"}
          alt={item.product.title}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold text-amber-900">{item.product.title}</p>
          {item.selectedAddOns?.length > 0 && (
            <p className="text-xs text-amber-800/80">
              Add-ons: {item.selectedAddOns.map((entry) => entry.name).join(", ")}
            </p>
          )}
          <p className="text-sm font-medium text-brand-700">Rs. {lineTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.lineKey, item.quantity - 1)}
          className="rounded-full border border-amber-300 p-2 text-amber-800 hover:border-brand-400"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold text-amber-900">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.lineKey, item.quantity + 1)}
          className="rounded-full border border-amber-300 p-2 text-amber-800 hover:border-brand-400"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemove(item.lineKey)}
          className="rounded-full border border-red-300 p-2 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
