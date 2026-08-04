
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = () => {
  // TODO: Replace with real authentication logic when backend is connected
  const isAuthenticated = true; // localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
