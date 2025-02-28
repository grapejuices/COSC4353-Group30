import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { isAdmin, isAuth } = useAuth();

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles.includes("admin") && isAdmin) {
        return <>{children}</>
    }

    if (allowedRoles.includes("volunteer") && !isAdmin) {
        return <>{children}</>
    }

    return <Navigate to="/" replace />;
};

export default ProtectedRoute;
