import React, { useState } from "react";
import AddShuttle from "./add-shutle";
import TrackPayment from "./track-payment";
import AllAvailableShuttle from "./all-available-shutle"; // Import CRUD shuttle component

const ShuttleAdminDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [shuttles, setShuttles] = useState([]);
  const [payments, setPayments] = useState([]);

  const addShuttle = (data) => {
    setShuttles(prev => [...prev, data]);
    setShowAddModal(false);
  };

  const editShuttle = (data) => {
    setShuttles(prev => prev.map(s => s.id === data.id ? data : s));
    setShowEditModal(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">ShuttleAdmin</div>
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-3">
          {/* Add Shuttle Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-3 rounded text-gray-100 hover:bg-gray-800 hover:text-white block"
          >
            + Add Shuttle
          </button>

          {/* Sidebar Links */}
          <a
            href="#shuttles"
            className="py-2 px-3 rounded text-gray-100 hover:bg-gray-800 hover:text-white block"
          >
            Shuttles
          </a>
          <a
            href="#payments"
            className="py-2 px-3 rounded text-gray-100 hover:bg-gray-800 hover:text-white block"
          >
            Payments
          </a>

                <a
            href="#payments"
            className="py-2 px-3 rounded text-gray-100 hover:bg-gray-800 hover:text-white block"
          >
            Profile
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Shuttle Admin
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-auto bg-gray-50 p-6 space-y-6">
        {/* Shuttle Table / CRUD */}
        <section id="shuttles">
          <AllAvailableShuttle /> {/* Render shuttle CRUD component */}
        </section>

        {/* Payments Tracker */}
        <TrackPayment payments={payments} />
      </div>

      {/* Add/Edit Shuttle Modal */}
      {(showAddModal || showEditModal) && (
        <AddShuttle
          title={showEditModal ? "Edit Shuttle" : "Add Shuttle"}
          initialData={showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(null);
          }}
          onSubmit={showEditModal ? editShuttle : addShuttle}
        />
      )}
    </div>
  );
};

export default ShuttleAdminDashboard;
