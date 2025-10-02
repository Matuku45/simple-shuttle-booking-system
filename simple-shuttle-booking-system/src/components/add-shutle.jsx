import React, { useState } from "react";
import AddShuttle from "./components/add-shutle";
import TrackPayment from "./components/track-payment";

export default function ShuttleAdminDashboard() {
  const [activeTab, setActiveTab] = useState("shuttles"); // "shuttles" or "payments"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">ShuttleAdmin</div>
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-3">
          <button
            onClick={() => setActiveTab("shuttles")}
            className={`flex items-center space-x-3 py-2 px-3 rounded w-full text-left hover:bg-gray-800 transition ${activeTab === "shuttles" ? "bg-gray-800" : ""}`}
          >
            <span>Shuttles</span>
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center space-x-3 py-2 px-3 rounded w-full text-left hover:bg-gray-800 transition ${activeTab === "payments" ? "bg-gray-800" : ""}`}
          >
            <span>Payments</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Shuttle Admin
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-auto p-6 bg-gray-50">
        {activeTab === "shuttles" && (
          <AddShuttle
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
          />
        )}

        {activeTab === "payments" && <TrackPayment />}
      </div>
    </div>
  );
}
