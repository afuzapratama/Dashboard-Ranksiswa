import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Konten di sisi kanan */}
      <div className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
