import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import { getImageUrl } from "../utils/getImageUrl";
import CategoryComparisonChart from "../components/charts/ComparisonChart";

export default function CandidatePublicView() {
  const { slug } = useParams();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [categoryCandidates, setCategoryCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await API.get(`/candidates/public/${slug}`);
        setCandidate(res.data.candidate);
        setCategoryCandidates(res.data.categoryCandidates || []);
        setSettings(res.data.settings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [slug]);

  const now = new Date();
  const votingStart = settings?.votingStart
    ? new Date(settings.votingStart)
    : null;
  const votingEnd = settings?.votingEnd ? new Date(settings.votingEnd) : null;

  const votingActive =
    votingStart && votingEnd ? now >= votingStart && now <= votingEnd : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading category candidates...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Candidate not found
          </h1>
          <p className="mt-2 text-slate-500">
            The candidate you are trying to view does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
            Award Category
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {candidate.category}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Candidates competing in the same award category appear below.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Candidates
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {categoryCandidates.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Voting Status</p>
            <h2
              className={`mt-2 text-2xl font-bold ${
                votingActive ? "text-green-600" : "text-amber-600"
              }`}
            >
              {votingActive ? "Active" : "Not Active"}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Voting Start</p>
            <h2 className="mt-2 text-sm font-bold text-slate-900">
              {settings?.votingStart
                ? new Date(settings.votingStart).toLocaleString()
                : "Not set"}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Voting End</p>
            <h2 className="mt-2 text-sm font-bold text-slate-900">
              {settings?.votingEnd
                ? new Date(settings.votingEnd).toLocaleString()
                : "Not set"}
            </h2>
          </div>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {categoryCandidates.map((item) => (
            <div
              key={item._id}
              className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                item.slug === candidate.slug
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {item.slug === candidate.slug && (
                  <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
                    Current Candidate
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.department}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Votes
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {settings?.candidateCanViewVotes ? item.votes : "--"}
                  </p>
                </div>

                {item.bio && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {item.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {settings?.candidateCanViewVotes ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Category Comparison Graph
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Compare vote progress for all candidates in this category over
                time.
              </p>
            </div>

            <CategoryComparisonChart candidates={categoryCandidates} />
          </div>
        ) : (
          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-800">
              Vote visibility is currently hidden
            </h2>
            <p className="mt-2 text-sm text-yellow-700">
              Candidate cards are visible, but vote totals and graphs are
              currently hidden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
