import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Edit Candidate</h1>

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

          <input
            type="number"
            name="votes"
            placeholder="Votes"
            value={formData.votes}
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
            <label className="mb-2 block font-medium">
              Change Candidate Image
            </label>
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
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Candidate"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
