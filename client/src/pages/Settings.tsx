import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Settings as SettingsType } from "../types";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [formData, setFormData] = useState({
    votingStart: "",
    votingEnd: "",
    candidateCanViewVotes: true,
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Voting Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="votingStart"
              value={formData.votingStart}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-800">
                Candidate Vote Visibility
              </h2>
              <p className="text-sm text-slate-500">
                Allow candidates to view their vote numbers and chart
              </p>
            </div>

            <input
              type="checkbox"
              name="candidateCanViewVotes"
              checked={formData.candidateCanViewVotes}
              onChange={handleChange}
              className="h-5 w-5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>

        {settings && (
          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-800">
              Current Settings
            </h2>
            <p>
              <strong>Voting Start:</strong>{" "}
              {settings.votingStart
                ? new Date(settings.votingStart).toLocaleString()
                : "Not set"}
            </p>
            <p>
              <strong>Voting End:</strong>{" "}
              {settings.votingEnd
                ? new Date(settings.votingEnd).toLocaleString()
                : "Not set"}
            </p>
            <p>
              <strong>Candidate Votes Visible:</strong>{" "}
              {settings.candidateCanViewVotes ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
