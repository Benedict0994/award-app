import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  UserCircle,
  LogOut,
  LayoutDashboard,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import useAuth from "../../context/useAuth";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function Sidebar({ open, setOpen }: Props) {
  const { logoutUser } = useAuth();
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
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white p-5 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold">Voting Admin</h1>
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                  active ? "bg-blue-600" : "hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 hover:bg-red-700"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>
    </>
  );
}
