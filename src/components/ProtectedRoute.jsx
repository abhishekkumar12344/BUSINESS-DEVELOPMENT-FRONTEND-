import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/** Guards admin routes and, optionally, restricts them to specific roles. */
const ProtectedRoute = ({ children, roles }) => {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Loader label="Checking your session" />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="admin-denied">
        <h2>You do not have access to this area</h2>
        <p>
          Your role is {user.role.replace('_', ' ').toLowerCase()}. Ask a super admin if you need access to this section.
        </p>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
