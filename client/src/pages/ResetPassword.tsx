import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter a new password for your admin account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
