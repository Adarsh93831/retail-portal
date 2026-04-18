/**
 * AddToCartButton Component
 * Renders product detail action button used to push selected item to cart.
 * Props: { onClick: Function, disabled?: Boolean }
 */
const AddToCartButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
