import React from 'react';
import Sidebar from '../../components/Sidebar';

const PrincipalDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Principal Dashboard</h1>
        {/* Dashboard content here */}
      </main>
    </div>
  );
};

export default PrincipalDashboard; 