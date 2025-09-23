export default function AppointmentsTab({ searchQuery }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <p className="text-gray-600">
        List of appointments {searchQuery ? `matching "${searchQuery}"` : ""}
      </p>
    </div>
  );
}
