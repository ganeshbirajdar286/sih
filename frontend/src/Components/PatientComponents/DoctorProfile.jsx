import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserMd,
  FaCertificate,
  FaChartLine,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { getSingleDoctor } from "../../feature/Patient/patient.thunk";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleDoctor, loading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getSingleDoctor(id));
  }, [dispatch, id]);

  if (loading || !singleDoctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  const doc = singleDoctor;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
            {doc.User_id?.Name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold">Dr. {doc.User_id?.Name}</h2>
            <p className="text-green-600 font-medium">{doc.Specialization}</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center">
            <FaChartLine className="mr-2 text-green-600" />
            {doc.Experience} Years Experience
          </p>

          <p className="flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            Joined: {new Date(doc.createdAt).toLocaleDateString()}
          </p>

          {doc.Certificates && (
            <p className="flex items-center">
              <FaCertificate className="mr-2 text-green-600" />
              <a
                href={doc.Certificates}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 underline"
              >
                View Certificate
              </a>
            </p>
          )}
        </div>

        {/* About Section */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">About Doctor</h3>
          <p className="text-gray-600">
            Experienced specialist in {doc.Specialization} with {doc.Experience}{" "}
            years of clinical practice.
          </p>
        </div>

        <button
          onClick={() => navigate(`/book-appointment/${doc._id}`)}
          className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg cursor-pointer"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
