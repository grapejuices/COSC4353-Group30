import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
    allowedRoles: "admin" | "volunteer";
    children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) return <p>Loading...</p>; 

    if (!user) return <Navigate to="/" replace />; 

    if (allowedRoles === "admin" && !isAdmin) return <Navigate to="/vdashboard" replace />;
    if (allowedRoles === "volunteer" && isAdmin) return <Navigate to="/adashboard" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;
