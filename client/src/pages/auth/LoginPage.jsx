import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthForm from "../../components/AuthForm";
import useAuthStore from "../../store/authStore";

/**
 * LoginPage Component
 * Renders login form and authenticates user with role-based redirect.
 * Props: none
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async ({ email, password }) => {
    const result = await login(email, password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Login successful");

    if (result.data.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-4">
        <div className="hero-gradient rounded-panel p-6 text-amber-900 shadow-panel">
          <h1 className="text-3xl font-extrabold">Retail Portal</h1>
          <p className="mt-1 text-sm font-medium">Fast ordering experience with admin inventory controls.</p>
        </div>

        <AuthForm mode="login" onSubmit={handleSubmit} isLoading={isLoading} />

        <p className="text-center text-sm text-amber-900/80">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
