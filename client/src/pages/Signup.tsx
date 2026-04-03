import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../context/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    awardName: "",
    awardSlug: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", formData);
      loginUser(res.data.user, res.data.token);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Admin Account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign up to manage your own award dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <input
            name="awardName"
            placeholder="Award name"
            value={formData.awardName}
            onChange={handleChange}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <input
            name="awardSlug"
            placeholder="Award slug (e.g. umat-awards)"
            value={formData.awardSlug}
            onChange={handleChange}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
