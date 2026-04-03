import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      loginUser(res.data.user, res.data.token);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error(error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Invalid login details"
        : "Invalid login details";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-slate-900 to-slate-950" />
          <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <ShieldCheck size={16} />
                Award Voting System
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">
                Manage your award elections with confidence.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
                Sign in to manage your own candidates, voting settings, award
                dashboard, and public candidate pages.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-medium text-slate-200">
                  Separate admin spaces
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Each admin only manages their own award system, candidates,
                  and settings.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-medium text-slate-200">
                  Secure database login
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Admin accounts are stored in MongoDB and protected with secure
                  authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={24} />
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your award admin dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <Mail size={18} className="mr-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <LockKeyhole size={18} className="mr-3 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-5 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an admin account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs leading-6 text-slate-500">
                  Protected admin access for managing candidates, votes, public
                  profiles, and election settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// our login.tsx works cleanly with the new,
// MongoDB admin accounts
//signup flow
// forgot password flow
// JWT login flow
