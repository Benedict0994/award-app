import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import VoteChart from "../components/charts/VoteChart";
import { Trophy, Users, BarChart3, Eye, EyeOff, Clock3 } from "lucide-react";

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [candidateRes, settingsRes] = await Promise.all([
          API.get("/candidates"),
          API.get("/settings"),
        ]);

        setCandidates(candidateRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalVotes = useMemo(() => {
    return candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  }, [candidates]);

  const topCandidate = useMemo(() => {
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.votes - a.votes)[0];
  }, [candidates]);

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
            <p className="text-slate-600">Loading dashboard...</p>
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
              Admin Overview
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor candidates, vote activity, and system settings from one
              place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Voting Status
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
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Candidates
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {candidates.length}
                </h2>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Votes
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalVotes}
                </h2>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <BarChart3 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
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

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Top Candidate
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {topCandidate ? topCandidate.name : "N/A"}
                </h2>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Trophy size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Performance Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vote movement for the leading candidate.
                </p>
              </div>

              {topCandidate && (
                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {topCandidate.name}
                </div>
              )}
            </div>

            {topCandidate ? (
              <VoteChart data={topCandidate.voteHistory} />
            ) : (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <p className="text-slate-500">No chart data available yet.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Clock3 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Voting Timeline
                  </h2>
                  <p className="text-sm text-slate-500">
                    Current schedule for this election.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Start Time
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {settings?.votingStart
                      ? new Date(settings.votingStart).toLocaleString()
                      : "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    End Time
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
                Quick Summary
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Candidates</span>
                  <span className="text-sm font-bold text-slate-900">
                    {candidates.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Votes Counted</span>
                  <span className="text-sm font-bold text-slate-900">
                    {totalVotes}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Visibility</span>
                  <span className="text-sm font-bold text-slate-900">
                    {settings?.candidateCanViewVotes ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Candidate Rankings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sorted by current vote count.
              </p>
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <p className="text-slate-500">No candidates available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...candidates]
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <div
                    key={candidate._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700">
                        #{index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {candidate.category} • {candidate.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Votes
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        {candidate.votes}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
