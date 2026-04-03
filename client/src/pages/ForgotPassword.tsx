import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setToken(res.data.resetToken);
      toast.success("Reset token generated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate reset token");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your admin email to generate a reset token.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {loading ? "Generating..." : "Generate Reset Token"}
          </button>
        </form>

        {token && (
          <div className="mt-6 rounded-2xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Reset Token
            </p>
            <p className="mt-2 break-all text-sm font-medium text-slate-900">
              {token}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
