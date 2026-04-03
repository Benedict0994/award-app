import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../context/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-6 text-sm text-slate-500">Admin account details</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Name
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.name || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Email
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.email || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Award Space
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.awardSpace || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
