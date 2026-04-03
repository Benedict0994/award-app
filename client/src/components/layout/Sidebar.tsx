import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  UserCircle,
  LogOut,
  X,
  Vote,
} from "lucide-react";
import useAuth from "../../context/useAuth";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: Props) {
  const { logoutUser, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/candidates", label: "Candidates", icon: Users },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
    { to: "/profile", label: "Profile", icon: UserCircle },
  ];

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px]"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Vote size={20} />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight">
                Award Voting
              </h1>
              <p className="text-xs text-slate-400">Admin Control Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 py-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Signed In
            </p>
            <h2 className="mt-2 text-sm font-semibold text-white">
              {user?.name || "Admin User"}
            </h2>
            <p className="mt-1 text-xs text-slate-400 break-all">
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div
                  className={`rounded-xl p-2 transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}