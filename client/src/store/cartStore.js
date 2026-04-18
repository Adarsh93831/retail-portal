import { create } from "zustand";

const toKey = (productId, selectedAddOns) => {
  return `${productId}-${JSON.stringify(selectedAddOns || [])}`;
};

const useCartStore = create((set, get) => ({
  items: [],

  /**
   * Adds one product line item to cart, or increases quantity if same line already exists.
   */
  addItem: (product, quantity = 1, selectedAddOns = []) => {
    const lineKey = toKey(product._id, selectedAddOns);

    set((state) => {
      const existingItemIndex = state.items.findIndex((item) => item.lineKey === lineKey);

      if (existingItemIndex !== -1) {
        const updated = [...state.items];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantity,
        };
        return { items: updated };
      }

      return {
        items: [
          ...state.items,
          {
            lineKey,
            product,
            quantity,
            selectedAddOns,
          },
        ],
      };
    });
  },

  /**
   * Removes a line item from cart by lineKey.
   */
  removeItem: (lineKey) => {
    set((state) => ({
      items: state.items.filter((item) => item.lineKey !== lineKey),
    }));
  },

  /**
   * Updates quantity for a line item and removes it if quantity becomes 0.
   */
  updateQuantity: (lineKey, quantity) => {
    const safeQuantity = Math.max(Number(quantity), 0);

    set((state) => {
      if (safeQuantity === 0) {
        return { items: state.items.filter((item) => item.lineKey !== lineKey) };
      }

      return {
        items: state.items.map((item) => {
          if (item.lineKey !== lineKey) {
            return item;
          }

          return {
            ...item,
            quantity: safeQuantity,
          };
        }),
      };
    });
  },

  /**
   * Clears all cart line items after successful checkout.
   */
  clearCart: () => {
    set({ items: [] });
  },

  /**
   * Returns current cart total including add-ons for each line item.
   */
  getTotal: () => {
    return get().items.reduce((sum, item) => {
      const addOnTotal = (item.selectedAddOns || []).reduce((addOnSum, addOn) => {
        return addOnSum + Number(addOn.price || 0);
      }, 0);

      return sum + (Number(item.product.cost) + addOnTotal) * item.quantity;
    }, 0);
  },
}));

export default useCartStore;
