import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen shadow-sm px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-3">
        <Link 
          to="/dashboard" 
          className="block text-gray-700 hover:text-blue-600"
        >
          Home
        </Link>
        <Link 
          to="/dashboard/students" 
          className="block text-gray-700 hover:text-blue-600"
        >
          Students
        </Link>
        <Link 
          to="/dashboard/subjects" 
          className="block text-gray-700 hover:text-blue-600"
        >
          Subjects
        </Link>
        <button 
          onClick={handleLogout}
          className="block text-left text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
