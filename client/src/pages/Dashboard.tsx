import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import VoteChart from "../components/charts/VoteChart";

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

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
      }
    }

    fetchData();
  }, []);

  const totalVotes = candidates.reduce(
    (sum, candidate) => sum + candidate.votes,
    0,
  );

  const topCandidate =
    candidates.length > 0
      ? [...candidates].sort((a, b) => b.votes - a.votes)[0]
      : null;

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-slate-500">Total Candidates</p>
          <h2 className="text-3xl font-bold">{candidates.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-slate-500">Total Votes</p>
          <h2 className="text-3xl font-bold">{totalVotes}</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-slate-500">Candidate Vote Visibility</p>
          <h2 className="text-xl font-bold">
            {settings?.candidateCanViewVotes ? "Visible" : "Hidden"}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow">
        <h3 className="mb-3 text-xl font-semibold">Voting Timeline</h3>
        <p>
          <strong>Start:</strong>{" "}
          {settings?.votingStart
            ? new Date(settings.votingStart).toLocaleString()
            : "Not set"}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {settings?.votingEnd
            ? new Date(settings.votingEnd).toLocaleString()
            : "Not set"}
        </p>
      </div>

      {topCandidate && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">
            Top Candidate: {topCandidate.name}
          </h2>
          <VoteChart data={topCandidate.voteHistory} />
        </div>
      )}
    </DashboardLayout>
  );
}
