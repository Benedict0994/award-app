import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import VoteChart from "../components/charts/VoteChart";
import { getImageUrl } from "../utils/getImageUrl";

export default function CandidatePublicView() {
  const { slug } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await API.get(`/candidates/public/${slug}`);
        setCandidate(res.data.candidate);
        setSettings(res.data.settings);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCandidate();
  }, [slug]);

  if (!candidate) {
    return <div className="p-8">Loading...</div>;
  }

  const now = new Date();
  const votingStart = settings?.votingStart
    ? new Date(settings.votingStart)
    : null;
  const votingEnd = settings?.votingEnd ? new Date(settings.votingEnd) : null;

  const votingActive =
    votingStart && votingEnd ? now >= votingStart && now <= votingEnd : false;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow">
        <img
          src={getImageUrl(candidate.image)}
          alt={candidate.name}
          className="h-80 w-full rounded-2xl object-cover"
        />

        <div className="mt-6">
          <h1 className="text-3xl font-bold">{candidate.name}</h1>
          <p className="text-lg text-slate-600">{candidate.category}</p>
          <p className="text-slate-600">{candidate.department}</p>
          <p className="mt-4 text-slate-700">{candidate.bio}</p>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p>
            <strong>Voting Start:</strong>{" "}
            {settings?.votingStart
              ? new Date(settings.votingStart).toLocaleString()
              : "Not set"}
          </p>
          <p>
            <strong>Voting End:</strong>{" "}
            {settings?.votingEnd
              ? new Date(settings.votingEnd).toLocaleString()
              : "Not set"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {votingActive ? "Voting Active" : "Voting Not Active"}
          </p>
        </div>

        {settings?.candidateCanViewVotes ? (
          <div className="mt-6">
            <div className="mb-4 rounded-xl bg-blue-50 p-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Votes: {candidate.votes}
              </h2>
            </div>
            <VoteChart data={candidate.voteHistory} />
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 text-yellow-800">
            Vote visibility is currently turned off. You can still view your
            profile.
          </div>
        )}
      </div>
    </div>
  );
}
