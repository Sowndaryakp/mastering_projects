import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const SIDEBAR_WIDTH = 224; // 56 * 4 (w-56 in Tailwind = 224px)

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main
        className="flex-1 p-8 lg:ml-56"
      >
        <h1 className="text-2xl font-bold mb-4 text-blue-800">Admin Dashboard</h1>
        {/* Dashboard content here */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminDashboard; 