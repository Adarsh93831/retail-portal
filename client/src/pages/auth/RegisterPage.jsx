import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthForm from "../../components/AuthForm";
import useAuthStore from "../../store/authStore";

/**
 * RegisterPage Component
 * Renders registration form for new customers and redirects after success.
 * Props: none
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async ({ name, email, password }) => {
    const result = await register(name, email, password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Account created successfully");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-4">
        <div className="hero-gradient rounded-panel p-6 text-amber-900 shadow-panel">
          <h1 className="text-3xl font-extrabold">Create Your Account</h1>
          <p className="mt-1 text-sm font-medium">Start browsing products and place orders in seconds.</p>
        </div>

        <AuthForm mode="register" onSubmit={handleSubmit} isLoading={isLoading} />

        <p className="text-center text-sm text-amber-900/80">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
