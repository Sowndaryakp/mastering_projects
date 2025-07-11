import React from 'react';

const Footer = () => (
  <footer className="w-full bg-blue-800 text-white text-center py-3 shadow-inner sticky bottom-0 left-0">
    <span className="text-sm">&copy; {new Date().getFullYear()} Online Exam Portal. All rights reserved.</span>
  </footer>
);

export default Footer; 