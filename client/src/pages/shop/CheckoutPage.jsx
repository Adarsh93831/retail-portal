import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import OrderSummary from "../../components/OrderSummary";
import useCartStore from "../../store/cartStore";

/**
 * CheckoutPage Component
 * Renders final order review and places order using cart state.
 * Props: none
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

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

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          selectedAddOns: item.selectedAddOns,
        })),
      };

      await axiosInstance.post("/orders", payload);
      clearCart();
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <h1 className="text-2xl font-extrabold text-amber-900">No items to checkout</h1>
        <p className="mt-2 text-sm text-amber-800/80">Add products to cart before checkout.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="glass-panel p-5">
        <h1 className="text-3xl font-extrabold text-amber-900">Checkout</h1>
        <p className="mt-2 text-sm text-amber-800/80">Review your selected items before placing order.</p>

        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div key={item.lineKey} className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-sm">
              <span>
                {item.product.title} x {item.quantity}
              </span>
              <span className="font-semibold text-amber-900">Rs. {(item.product.cost * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <OrderSummary subtotal={amounts.subtotal} tax={amounts.tax} total={total} />
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing Order..." : "Confirm Order"}
        </button>
      </section>
    </div>
  );
};

export default CheckoutPage;
