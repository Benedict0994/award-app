import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImagePlus,
  Save,
  UserRound,
  Trophy,
  Building2,
  FileText,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";

export default function AddCandidate() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    department: "",
    bio: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      formData.department.trim() &&
      image
    );
  }, [formData, image]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all required fields and upload an image");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("department", formData.department);
      payload.append("bio", formData.bio);
      if (image) {
        payload.append("image", image);
      }

      await API.post("/candidates", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Candidate added successfully");
      navigate("/candidates");
    } catch (error) {
      console.error(error);
      alert("Failed to add candidate");
    } finally {
      setLoading(false);
    }
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
              Add Candidate
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new candidate profile with image, category, department,
              and biography.
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
                Candidate Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the required information to create a complete candidate
                profile.
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
                  Candidate Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <ImagePlus size={30} className="text-slate-500" />
                  <span className="mt-3 text-sm font-medium text-slate-700">
                    Click to upload candidate image
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG, or WEBP supported
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
                disabled={loading || !isFormValid}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Candidate"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Live Preview</h2>
              <p className="mt-1 text-sm text-slate-500">
                See how the candidate card will feel visually.
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
                    <p className="text-lg font-bold text-slate-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Quick Guide</h2>

              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Name</p>
                  <p className="mt-1">
                    Use the candidate’s full official name for clarity.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Category</p>
                  <p className="mt-1">
                    The award group the candidate is competing in.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Image</p>
                  <p className="mt-1">
                    Upload a clear portrait or quality image for a better public
                    profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-blue-900">Admin Note</h2>
              <p className="mt-3 text-sm leading-6 text-blue-800">
                Candidates added here will appear on the dashboard and public
                candidate profile page immediately after creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
