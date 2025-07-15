import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 224; // px, matches Sidebar

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <div className="flex flex-1 pt-20" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar (fixed width) */}
      <div className="hidden lg:block" style={{ width: SIDEBAR_WIDTH }}>
        <Sidebar />
      </div>
      {/* Main content area */}
      <main className="flex-1 p-4 ml-0 lg:ml-4" style={{ minHeight: 'calc(100vh - 80px - 56px)' }}>
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

export default Layout; 