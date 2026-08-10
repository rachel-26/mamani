
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');

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
