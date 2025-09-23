import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Home, Users } from "lucide-react";

const sidebarItems = [
  { id: 1, label: "Dashboard", icon: Home },
  { id: 2, label: "Patients", icon: Users },
];

const Parent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}       // control visibility
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />  {/* open sidebar */}
        <main className="p-4">
          <h1>Dashboard Content</h1>
        </main>
      </div>
    </div>
  );
};

export default Parent;
