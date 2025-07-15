import React, { useState, useRef, useEffect } from 'react';
import useAuthStore from '../store/login';

const SIDEBAR_WIDTH = 224; // 56 * 4 (w-56 in Tailwind = 224px)

const Header = () => {
  const { user, role, logout, toggleSidebar } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen]);

  // Get initials for avatar
  const getInitials = (email) => {
    if (!email) return '';
    const [name] = email.split('@');
    return name
      .split('.')
      .map((n) => n[0]?.toUpperCase())
      .join('');
  };

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-40 border-b border-gray-200 h-20 flex items-center">
      <div className="relative flex items-center w-full px-4 sm:px-6 lg:px-8">
        {/* Hamburger for mobile/tablet */}
        <button
          className="lg:hidden flex-shrink-0 focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <svg className="w-7 h-7 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Title always centered using absolute positioning on mobile, static on lg+ */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-800 tracking-wide lg:static lg:transform-none lg:left-auto lg:top-auto lg:mx-0">
          Online Exam Portal
        </div>
        {/* Right side icons, always visible on mobile except profile details and logout */}
        <div className="flex items-center gap-4 ml-auto sm:gap-6">
          {/* Notification Bell */}
          <button className="relative focus:outline-none group" title="Notifications">
            <svg className="w-6 h-6 text-blue-700 group-hover:text-blue-900 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification dot */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
          {/* Profile Avatar */}
          {user && (
            <div className="flex items-center gap-2 relative">
              <div
                className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg border border-blue-300 cursor-pointer"
                onClick={() => setProfileOpen((v) => !v)}
                ref={profileRef}
              >
                {getInitials(user.email)}
              </div>
              {/* Profile popup for mobile */}
              {profileOpen && (
                <div className="absolute -left-36 top-12 sm:hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[180px] text-center">
                  <div className="text-gray-700 font-medium text-base mb-1">{user.email}</div>
                  <div className="text-xs text-blue-600 font-semibold mb-2">{role}</div>
                  <button
                    onClick={logout}
                    className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition text-sm w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
              <div className="flex flex-col text-right max-sm:hidden">
                <span className="text-gray-700 font-medium text-sm">{user.email}</span>
                <span className="text-xs text-blue-600 font-semibold">{role}</span>
              </div>
            </div>
          )}
          {/* Logout Button */}
          {user && (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition text-sm max-sm:hidden"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {/* Only apply marginLeft for large screens */}
      <style>{`
        @media (min-width: 1024px) {
          .header-margin-lg {
            margin-left: ${SIDEBAR_WIDTH}px !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 