import { useState, useEffect, lazy, Suspense } from "react";
import { AppProvider, useApp } from "@/components/AppContext";
import LoginPage from "@/views/LoginPage";
import HomePage from "@/views/HomePage";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Lazy load heavy dashboard views
const StudentDashboard = lazy(() => import("@/views/StudentDashboard"));
const TeacherDashboard = lazy(() => import("@/views/TeacherDashboard"));
const AdminDashboard = lazy(() => import("@/views/AdminDashboard"));

function NavigationWrapper() {
  const { currentUser } = useApp();
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#/");

  // Sync hash state to trigger updates
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Secure Route Guards and Redirections
  useEffect(() => {
    const hash = window.location.hash || "#/";

    if (currentUser) {
      // If logged in, block login route and send to dashboard
      if (hash === "#/login") {
        window.location.hash = "#/dashboard";
      }
    } else {
      // If logged out, block access to any dashboard path
      if (hash.startsWith("#/dashboard")) {
        window.location.hash = "#/";
      }
    }
  }, [currentUser, currentHash]);

  // Resolve view based on currentHash
  if (currentHash === "#/login") {
    if (currentUser) {
      window.location.hash = "#/dashboard";
      return <LoadingScreen />;
    }
    return <LoginPage onBack={() => { window.location.hash = "#/"; }} />;
  }

  if (currentHash.startsWith("#/dashboard")) {
    if (!currentUser) {
      window.location.hash = "#/";
      return <LoadingScreen />;
    }
    return (
      <Suspense fallback={<LoadingScreen />}>
        {currentUser.role === "profesor" ? (
          <TeacherDashboard />
        ) : currentUser.role === "administrativo" ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard />
        )}
      </Suspense>
    );
  }

  // Default: HomePage
  return (
    <HomePage
      onLoginClick={() => {
        window.location.hash = currentUser ? "#/dashboard" : "#/login";
      }}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationWrapper />
    </AppProvider>
  );
}
