import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../components/CartItem";
import OrderSummary from "../../components/OrderSummary";
import useCartStore from "../../store/cartStore";

/**
 * CartPage Component
 * Renders cart items with quantity controls and route to checkout.
 * Props: none
 */
const CartPage = () => {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const amounts = items.reduce(
    (acc, item) => {
      const addOnTotal = (item.selectedAddOns || []).reduce((sum, addOn) => sum + Number(addOn.price || 0), 0);
      const lineSubtotal = (Number(item.product.cost) + addOnTotal) * item.quantity;
      const lineTax = lineSubtotal * (Number(item.product.taxPercent || 0) / 100);

      return {
        subtotal: acc.subtotal + lineSubtotal,
        tax: acc.tax + lineTax,
      };
    },
    { subtotal: 0, tax: 0 }
  );

  const total = amounts.subtotal + amounts.tax;

  if (items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <h1 className="text-2xl font-extrabold text-amber-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-amber-800/80">Browse products and add your favorites.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold text-amber-900">Your Cart</h1>
        {items.map((item) => (
          <CartItem key={item.lineKey} item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
        ))}
      </section>

      <section className="space-y-4">
        <OrderSummary subtotal={amounts.subtotal} tax={amounts.tax} total={total} />
        <button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-full bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Proceed to Checkout
        </button>
      </section>
    </div>
  );
};

export default CartPage;
