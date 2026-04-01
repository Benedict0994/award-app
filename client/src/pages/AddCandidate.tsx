import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.department ||
      !image
    ) {
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
      payload.append("image", image);

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
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Add Candidate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Candidate name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            name="category"
            placeholder="Award category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            name="bio"
            placeholder="Candidate bio"
            value={formData.bio}
            onChange={handleChange}
            className="min-h-32 w-full rounded-xl border px-4 py-3"
          />

          <div>
            <label className="mb-2 block font-medium">Candidate Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-56 w-full rounded-xl object-cover"
            />
          )}

          <button
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Candidate"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
