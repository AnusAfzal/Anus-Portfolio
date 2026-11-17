import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicPortfolio from "./pages/PublicPortfolio";
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import "./App.css";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

function AdminLoading() {
  return (
    <div className="admin-loading-screen" role="status" aria-label="Loading console">
      <div className="admin-spinner" />
      <p className="admin-loading-text font-mono">Loading console...</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AdminLoading />}>
          <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Authentication & Management */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
