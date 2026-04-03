import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate } from "../types";
import { getImageUrl } from "../utils/getImageUrl";

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCandidates() {
    try {
      const res = await API.get("/candidates");
      setCandidates(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate?",
    );

    if (!confirmed) return;

    try {
      await API.delete(`/candidates/${id}`);
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== id));
      alert("Candidate deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete candidate");
    }
  }

  const totalVotes = candidates.reduce(
    (sum, candidate) => sum + candidate.votes,
    0,
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Candidates
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage nominees, review profiles, and track vote activity.
            </p>
          </div>

          <Link
            to="/candidates/add"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Add Candidate
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Candidates
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {candidates.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Votes</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {totalVotes}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Active List
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No candidates yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start by adding your first candidate to the voting system.
            </p>

            <Link
              to="/candidates/add"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Candidate
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(candidate.image)}
                    alt={candidate.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                    {candidate.category}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      {candidate.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {candidate.department}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Votes
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {candidate.votes}
                      </p>
                    </div>

                    <Link
                      to={`/candidate-view/${candidate.slug}`}
                      className="inline-lfex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      <ExternalLink size={16} />
                      Candidate View
                    </Link>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/candidates/edit/${candidate._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(candidate._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
