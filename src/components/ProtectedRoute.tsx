import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    isLoggedIn: boolean;
}

export default function ProtectedRoute({ children, isLoggedIn }: ProtectedRouteProps) {
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}
