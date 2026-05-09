import React from 'react';
import Sidebar from './sidebar';

export default function Layout({ children }) {
  return (
    // Use w-screen and h-screen to fill the entire browser window
    <div className="flex w-screen h-screen bg-[#EDEFD7] overflow-hidden">
      <Sidebar />
      {/* flex-1 makes this area take up all space not used by the sidebar */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}