import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import AdminPanel from "@/components/admin-panel";
import { useLocation } from "wouter";

export default function Admin() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const [, setLocation] = useLocation();

  if (!isAuthenticated || !isAdmin) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <AdminPanel />
    </div>
  );
}
