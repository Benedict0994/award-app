import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  FileText,
  ImagePlus,
  Pencil,
  Save,
  Trophy,
  UserRound,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    department: "",
    bio: "",
    votes: 0,
    image: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await API.get(`/candidates/${id}`);

        setFormData({
          name: res.data.name || "",
          category: res.data.category || "",
          department: res.data.department || "",
          bio: res.data.bio || "",
          votes: res.data.votes || 0,
          image: res.data.image || "",
        });

        setPreview(getImageUrl(res.data.image));
      } catch (error) {
        console.error(error);
        alert("Failed to load candidate");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "votes" ? Number(value) : value,
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.category.trim() &&
      formData.department.trim()
    );
  }, [formData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("department", formData.department);
      payload.append("bio", formData.bio);
      payload.append("votes", String(formData.votes));

      if (image) {
        payload.append("image", image);
      }

      await API.put(`/candidates/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Candidate updated successfully");
      navigate("/candidates");
    } catch (error) {
      console.error(error);
      alert("Failed to update candidate");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading candidate...</p>
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
              Candidate Management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Edit Candidate
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Update candidate details, image, bio, and vote count.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Form Status
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                isFormValid ? "text-green-600" : "text-amber-600"
              }`}
            >
              {isFormValid ? "Ready" : "Incomplete"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Update Candidate Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Edit the candidate profile and save changes instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <UserRound size={16} />
                    Candidate Name
                  </label>
                  <input
                    name="name"
                    placeholder="Enter candidate name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Trophy size={16} />
                    Award Category
                  </label>
                  <input
                    name="category"
                    placeholder="Enter award category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Building2 size={16} />
                    Department
                  </label>
                  <input
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Pencil size={16} />
                    Votes
                  </label>
                  <input
                    type="number"
                    name="votes"
                    placeholder="Enter vote count"
                    value={formData.votes}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText size={16} />
                  Candidate Bio
                </label>
                <textarea
                  name="bio"
                  placeholder="Write a short biography or description"
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-36 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ImagePlus size={16} />
                  Change Candidate Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <ImagePlus size={30} className="text-slate-500" />
                  <span className="mt-3 text-sm font-medium text-slate-700">
                    Click to upload a new candidate image
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Leave unchanged if you want to keep the current image
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving || !isFormValid}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={18} />
                {saving ? "Updating..." : "Update Candidate"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Live Preview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Preview how the candidate card will appear after update.
              </p>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image selected
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                    {formData.category || "Category"}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      {formData.name || "Candidate Name"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {formData.department || "Department"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Votes
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {formData.votes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Update Tips</h2>

              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Votes</p>
                  <p className="mt-1">
                    Changing votes will update the vote history for analytics.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Image</p>
                  <p className="mt-1">
                    Upload a new image only if you want to replace the current
                    one.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Bio</p>
                  <p className="mt-1">
                    Keep the biography clear and short for a better public
                    profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-blue-900">Admin Note</h2>
              <p className="mt-3 text-sm leading-6 text-blue-800">
                Any update made here will affect the dashboard, candidate public
                profile, and vote analytics immediately after saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
