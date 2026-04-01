import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../context/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </DashboardLayout>
  );
}
