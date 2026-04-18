import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";

/**
 * ProductCard Component
 * Renders a product tile with image, details, and add-to-cart action.
 * Props: { product: Object, onAddToCart?: Function }
 */
const ProductCard = ({ product, onAddToCart }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    addItem(product, 1, []);
    toast.success("Added to cart");
  };

  return (
    <article className="glass-panel flex h-full flex-col overflow-hidden">
      <img
        src={product.image || "https://placehold.co/600x400?text=No+Image"}
        alt={product.title}
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-amber-900">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-amber-800/80">{product.description}</p>
        <p className="mt-3 text-lg font-extrabold text-brand-700">Rs. {Number(product.cost).toFixed(2)}</p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/product/${product._id}`}
            className="rounded-full border border-amber-300 px-3 py-1.5 text-sm font-semibold text-amber-900 hover:border-brand-500 hover:text-brand-700"
          >
            View
          </Link>
          <button
            onClick={handleAdd}
            className="rounded-full bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
