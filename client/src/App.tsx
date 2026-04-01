import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import EditCandidate from "./pages/EditCandidate";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CandidatePublicView from "./pages/CandidatePublicView";
import useAuth from "./context/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates/add"
          element={
            <ProtectedRoute>
              <AddCandidate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates/edit/:id"
          element={
            <ProtectedRoute>
              <EditCandidate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/candidate-view/:slug" element={<CandidatePublicView />} />
      </Routes>
    </BrowserRouter>
  );
}
