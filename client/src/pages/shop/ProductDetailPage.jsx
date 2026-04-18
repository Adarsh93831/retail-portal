import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddOnSelector from "../../components/AddOnSelector";
import AddToCartButton from "../../components/AddToCartButton";
import Breadcrumb from "../../components/Breadcrumb";
import ComboSection from "../../components/ComboSection";
import Spinner from "../../components/Spinner";
import useCartStore from "../../store/cartStore";
import useProductStore from "../../store/productStore";

/**
 * ProductDetailPage Component
 * Renders selected product details with add-ons, combos, and add-to-cart action.
 * Props: none
 */
const ProductDetailPage = () => {
  const { id } = useParams();

  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const isLoading = useProductStore((state) => state.isLoading);

  const addItem = useCartStore((state) => state.addItem);

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(id);
    setSelectedAddOns([]);
    setQuantity(1);
  }, [id]);

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const alreadySelected = prev.some((item) => item.name === addOn.name);
      if (alreadySelected) {
        return prev.filter((item) => item.name !== addOn.name);
      }
      return [...prev, { name: addOn.name, price: Number(addOn.price) }];
    });
  };

  const unitPrice = useMemo(() => {
    if (!selectedProduct) {
      return 0;
    }

    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + Number(addOn.price), 0);
    return Number(selectedProduct.cost) + addOnTotal;
  }, [selectedProduct, selectedAddOns]);

  const handleAddToCart = () => {
    if (!selectedProduct) {
      return;
    }

    addItem(selectedProduct, quantity, selectedAddOns);
    toast.success("Item added to cart");
  };

  if (isLoading) {
    return <Spinner label="Loading product details..." />;
  }

  if (!selectedProduct) {
    return <p className="text-sm text-amber-800/70">Product not found.</p>;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: selectedProduct.category?.name || "Category", to: `/category/${selectedProduct.category?._id}` },
          { label: selectedProduct.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass-panel overflow-hidden">
          <img
            src={selectedProduct.image || "https://placehold.co/900x600?text=Product"}
            alt={selectedProduct.title}
            className="h-72 w-full object-cover"
          />
          <div className="space-y-3 p-5">
            <h1 className="text-3xl font-extrabold text-amber-900">{selectedProduct.title}</h1>
            <p className="text-sm text-amber-800/90">{selectedProduct.description}</p>
            <p className="text-sm text-amber-800/80">Tax: {selectedProduct.taxPercent}%</p>
            <p className="text-2xl font-extrabold text-brand-700">Rs. {(unitPrice * quantity).toFixed(2)}</p>

            <div className="flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-semibold text-amber-900">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={selectedProduct.stock || 99}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value || 1)))}
                className="w-20 rounded-lg border border-amber-300 px-2 py-1"
              />
            </div>

            <AddToCartButton onClick={handleAddToCart} disabled={!selectedProduct.isAvailable || selectedProduct.stock < 1} />
          </div>
        </section>

        <div className="space-y-4">
          <AddOnSelector addOns={selectedProduct.addOns} selected={selectedAddOns} onToggle={toggleAddOn} />
          <ComboSection combos={selectedProduct.combos} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
