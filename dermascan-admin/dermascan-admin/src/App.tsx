import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminSignup from "./pages/AdminSignup";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Conseils from "./pages/Conseils";
import Analyses from "./pages/Analyses";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-signup" element={<AdminSignup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/conseils"
        element={
          <ProtectedRoute>
            <Layout>
              <Conseils />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analyses"
        element={
          <ProtectedRoute>
            <Layout>
              <Analyses />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout>
              <Stats />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;