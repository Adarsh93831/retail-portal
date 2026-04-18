import { Link } from "react-router-dom";

/**
 * NotFoundPage Component
 * Renders fallback UI for routes that do not exist in the router map.
 * Props: none
 */
const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-md space-y-4 p-8 text-center">
        <h1 className="text-4xl font-extrabold text-amber-900">404</h1>
        <p className="text-sm text-amber-800/80">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
