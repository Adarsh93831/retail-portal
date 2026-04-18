import { NavLink, Outlet } from "react-router-dom";

/**
 * AdminDashboard Component
 * Renders admin sidebar navigation with outlet for nested admin pages.
 * Props: none
 */
const AdminDashboard = () => {
  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-brand-500 text-white" : "text-amber-900 hover:bg-amber-100"
    }`;

  return (
    <div className="min-h-screen bg-amber-50/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="glass-panel h-fit p-4">
          <h2 className="mb-4 text-xl font-extrabold text-amber-900">Admin Panel</h2>
          <nav className="space-y-2">
            <NavLink to="/admin/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/admin/stock" className={navLinkClass}>
              Stock
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              Orders
            </NavLink>
            <NavLink to="/" className={navLinkClass}>
              Back to Shop
            </NavLink>
          </nav>
        </aside>

        <section className="glass-panel min-h-[70vh] p-5 sm:p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
