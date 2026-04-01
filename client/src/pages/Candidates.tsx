import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate } from "../types";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
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

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <Link
          to="/candidates/add"
          className="rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
        >
          Add Candidate
        </Link>
      </div>

      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-600">No candidates added yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="h-56 w-full rounded-xl object-cover"
            >
              <img
                src={getImageUrl(candidate.image)}
                alt={candidate.name}
                className="h-56 w-full rounded-xl object-cover"
              />

              <div className="mt-4">
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <p className="text-slate-600">{candidate.category}</p>
                <p className="text-slate-600">{candidate.department}</p>
                <p className="mt-2 font-semibold">Votes: {candidate.votes}</p>

                <a
                  href={`http://localhost:5173/candidate-view/${candidate.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-blue-600 font-medium"
                >
                  <ExternalLink size={16} />
                  Candidate View Link
                </a>

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/candidates/edit/${candidate._id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(candidate._id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
    </DashboardLayout>
  );
}
