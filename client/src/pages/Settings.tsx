import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Settings as SettingsType } from "../types";
import { CalendarDays, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [formData, setFormData] = useState({
    votingStart: "",
    votingEnd: "",
    candidateCanViewVotes: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await API.get("/settings");
        setSettings(res.data);

        setFormData({
          votingStart: res.data.votingStart
            ? res.data.votingStart.slice(0, 16)
            : "",
          votingEnd: res.data.votingEnd ? res.data.votingEnd.slice(0, 16) : "",
          candidateCanViewVotes: res.data.candidateCanViewVotes,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        votingStart: formData.votingStart
          ? new Date(formData.votingStart).toISOString()
          : null,
        votingEnd: formData.votingEnd
          ? new Date(formData.votingEnd).toISOString()
          : null,
        candidateCanViewVotes: formData.candidateCanViewVotes,
      };

      const res = await API.put("/settings", payload);
      setSettings(res.data);
      alert("Settings updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  const votingStatus = useMemo(() => {
    if (!settings?.votingStart || !settings?.votingEnd) {
      return "Not configured";
    }

    const now = new Date();
    const start = new Date(settings.votingStart);
    const end = new Date(settings.votingEnd);

    if (now < start) return "Not started";
    if (now > end) return "Ended";
    return "Active";
  }, [settings]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              System Control
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Control vote visibility, scheduling, and election timing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Status
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                votingStatus === "Active"
                  ? "text-green-600"
                  : votingStatus === "Ended"
                    ? "text-red-600"
                    : "text-amber-600"
              }`}
            >
              {votingStatus}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Vote Visibility
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {settings?.candidateCanViewVotes ? "Visible" : "Hidden"}
                </h2>
              </div>

              <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
                {settings?.candidateCanViewVotes ? (
                  <Eye size={22} />
                ) : (
                  <EyeOff size={22} />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Start Time</p>
                <h2 className="mt-2 text-base font-bold text-slate-900">
                  {settings?.votingStart
                    ? new Date(settings.votingStart).toLocaleDateString()
                    : "Not set"}
                </h2>
              </div>

              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">End Time</p>
                <h2 className="mt-2 text-base font-bold text-slate-900">
                  {settings?.votingEnd
                    ? new Date(settings.votingEnd).toLocaleDateString()
                    : "Not set"}
                </h2>
              </div>

              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Security</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Protected
                </h2>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Voting Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the schedule for the election and control what candidates
                are allowed to see.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Voting Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="votingStart"
                    value={formData.votingStart}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Voting End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="votingEnd"
                    value={formData.votingEnd}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Candidate Vote Visibility
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Decide whether candidates can view their vote totals and
                      vote chart on the public profile page.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {formData.candidateCanViewVotes ? "Enabled" : "Disabled"}
                    </span>

                    <div className="relative">
                      <input
                        type="checkbox"
                        name="candidateCanViewVotes"
                        checked={formData.candidateCanViewVotes}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-blue-600" />
                      <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Current Schedule
              </h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Voting Start
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {settings?.votingStart
                      ? new Date(settings.votingStart).toLocaleString()
                      : "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Voting End
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {settings?.votingEnd
                      ? new Date(settings.votingEnd).toLocaleString()
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Visibility Summary
              </h2>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Candidate Access
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {settings?.candidateCanViewVotes
                    ? "Candidates can view votes and chart"
                    : "Candidates can only view profile information"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-blue-900">Admin Note</h2>
              <p className="mt-3 text-sm leading-6 text-blue-800">
                Changes made here affect the public candidate pages immediately
                after saving. Make sure your voting start and end times are
                accurate before the election begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
