import { useState } from "react";

/**
 * AuthForm Component
 * Renders shared login/register form fields and submit action.
 * Props: { mode: "login"|"register", onSubmit: Function, isLoading: Boolean }
 */
const AuthForm = ({ mode, onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "register") {
      onSubmit({ name, email, password });
      return;
    }

    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-extrabold text-amber-900">
        {mode === "register" ? "Create Account" : "Welcome Back"}
      </h1>

      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900">Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 outline-none focus:border-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-brand-500 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
