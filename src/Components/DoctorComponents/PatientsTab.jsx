export default function PatientsTab({ searchQuery }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">My Patients</h2>
      <p className="text-gray-600">
        Showing patients {searchQuery ? `for "${searchQuery}"` : ""}
      </p>
    </div>
  );
}
