import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Shield } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import SearchBar from "./SearchBar";

/**
 * Navbar Component
 * Renders top navigation, global search, cart shortcut, and auth actions.
 * Props: none
 */
const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const items = useCartStore((state) => state.items);

  const cartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success("Logged out successfully");
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };

  const handleSearch = (keyword) => {
    navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-amber-900">
          <span className="rounded-lg bg-brand-500 px-2 py-1 text-white">Retail</span>
          <span>Portal</span>
        </Link>

        <div className="order-3 w-full md:order-2 md:flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-4 md:order-3">
          <NavLink to="/orders" className="text-sm font-medium text-amber-900 hover:text-brand-700">
            Orders
          </NavLink>
          <NavLink to="/cart" className="relative text-sm font-medium text-amber-900 hover:text-brand-700">
            <span className="inline-flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" /> Cart
            </span>
            {cartQuantity > 0 && (
              <span className="absolute -right-3 -top-3 rounded-full bg-brand-600 px-1.5 py-0.5 text-xs text-white">
                {cartQuantity}
              </span>
            )}
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-amber-900 hover:text-brand-700">
              <Shield className="h-4 w-4" /> Admin
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="rounded-full border border-amber-300 px-3 py-1.5 text-sm font-semibold text-amber-900 transition hover:border-brand-500 hover:text-brand-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
