import React from "react";
import { FaSearch, FaBell, FaUserMd } from "react-icons/fa";

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="flex items-center space-x-4">
        
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-gray-600" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border border-green-300 shadow-sm">
          <FaUserMd className="text-green-700" />
        </div>
      </div>
    </header>
  );
}
