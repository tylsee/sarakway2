import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Verify from "./pages/auth/verify";
import AdminAlerts from "./pages/admin/AdminAlerts";
import GuideAlerts from "./pages/guide/GuideAlerts";
import AdminCourses from "./pages/admin/courses/AdminCourses";
import CourseEditor from "./pages/admin/courses/CourseEditor";
import GuideCourses from "./pages/guide/GuideCourses";
import GuideCourseView from "./pages/guide/GuideCourseView";
import GuideProgress from "./pages/guide/GuideProgress";
import AdminBadges from "./pages/admin/AdminBadges";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminGuideDetails from "./pages/admin/AdminGuideDetails";
import AdminTrainingOverview from "./pages/admin/AdminTrainingOverview";
import AdminNotifications from "./pages/admin/AdminNotifications";
import GuideNotifications from "./pages/guide/GuideNotifications";
import AdminProfile from "./pages/admin/AdminProfile";
import GuideProfile from "./pages/guide/GuideProfile";
import ProtectedRoute from "./components/protectedroute";

import "./App.css";

function App() {
  const location = useLocation();
  const hideSidebar = ["/register", "/login"].includes(location.pathname);
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content */}
      <div className={`main-content ${hideSidebar ? "full" : ""}`}>
        <Routes>

          {/* PUBLIC ROUTES */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify"
            element={<Verify />}
          />

          {/* ADMIN ROUTES */}

          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <AdminCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses/:id"
            element={
              <ProtectedRoute>
                <CourseEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminGuides />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute>
                <AdminGuideDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/trainingoverview"
            element={
              <ProtectedRoute>
                <AdminTrainingOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/alerts"
            element={
              <ProtectedRoute>
                <AdminAlerts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/badges"
            element={
              <ProtectedRoute>
                <AdminBadges />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/device"
            element={
              <ProtectedRoute>
                <h1>Device Management</h1>
              </ProtectedRoute>
            }
          />

          {/* GUIDE ROUTES */}

          <Route
            path="/guide/courses"
            element={
              <ProtectedRoute>
                <GuideCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/courses/:id"
            element={
              <ProtectedRoute>
                <GuideCourseView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/progress"
            element={
              <ProtectedRoute>
                <GuideProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/alerts"
            element={
              <ProtectedRoute>
                <GuideAlerts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/notifications"
            element={
              <ProtectedRoute>
                <GuideNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/profile"
            element={
              <ProtectedRoute>
                <GuideProfile />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}

          <Route
            path="/"
            element={<Login />}
          />

        </Routes>
      </div>
    </div>
  );
}

export default App;
