import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserMd,
  FaChartLine,
  FaStar,
  FaSearch,
  FaFilter,
  FaCertificate,
  FaCalendarAlt,
  FaClock,
  FaSpinner,
  FaCommentMedical,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { doctor, addOrUpdateReview, getReview } from "../../feature/Patient/patient.thunk";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const specialties = [
  "All Specialties",
  "Oncologist",
  "Cardiologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Neurologist",
  "Obstetrics and Gynaecology",
  "Ophthalmologist",
  "Family doctor",
  "Psychiatrist",
  "Pediatrician",
  "Allergist",
  "Geriatrician",
  "Internal medicine",
  "Nephrologist",
  "Orthopedics",
  "Anesthesiologist",
  "Dermatologist",
];

/* ── Star Display (read-only) ── */
const StarDisplay = ({ rating, total }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
    <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
    {total !== undefined && (
      <span className="text-xs text-gray-400">
        ({total} review{total !== 1 ? "s" : ""})
      </span>
    )}
  </div>
);

/* ── Star Picker (interactive) ── */
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`w-7 h-7 cursor-pointer transition-all duration-150 hover:scale-110 ${
            star <= (hovered || value) ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
      {value > 0 && (
        <span className="ml-1 text-xs text-yellow-600 font-semibold">{labels[value]}</span>
      )}
    </div>
  );
};

/* ── Review Card ── */
const ReviewCard = ({ review, currentPatientId, onEdit }) => {
  const isOwn = review.Patient?._id === currentPatientId;
  const name = review.Patient?.Name || "Anonymous";
  const avatar = review.Patient?.Image_url;
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`p-3 rounded-xl border ${isOwn ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <FaUserCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">
              {name} {isOwn && <span className="text-yellow-600">(You)</span>}
            </p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={`w-3 h-3 ${s <= review.rating ? "text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{date}</span>
          {isOwn && (
            <button onClick={onEdit} className="text-yellow-500 hover:text-yellow-700 transition-colors p-1" title="Edit your review">
              <FaEdit className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {/* Scrollable comment */}
      <div className="mt-2 max-h-20 overflow-y-auto rounded-lg bg-white/60 px-2 py-1.5">
        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

/* ── Reviews Panel ── */
const ReviewsPanel = ({ doctorId, avgRating, totalReviews, currentPatientId }) => {
  const dispatch = useDispatch();
  const { reviews, reviewLoading } = useSelector((state) => state.patient);

  // showForm starts as false — form only opens when user explicitly clicks the button
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const docReviews = reviews[doctorId];
  const reviewList  = docReviews?.list ?? [];

  // Only use live Redux data once getReview has resolved (docReviews exists).
  // While loading, fall back to the prop values from the doctor object.
  const displayAvg   = docReviews ? docReviews.avgRating  : avgRating;
  const displayTotal = docReviews ? docReviews.total      : totalReviews;

  // Find the current patient's existing review in the fetched list
  const myReview = reviewList.find((r) => r.Patient?._id === currentPatientId);

  // Fetch reviews when the panel first mounts (not before)
  useEffect(() => {
    dispatch(getReview({ id: doctorId }));
  }, [dispatch, doctorId]);

  // Open the form — pre-fill if the user already has a review
  const openForm = () => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setRating(0);
    setComment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    const isUpdate = Boolean(myReview);
    const result = await dispatch(addOrUpdateReview({ id: doctorId, form: { rating, comment } }));

    if (addOrUpdateReview.fulfilled.match(result)) {
      toast.success(isUpdate ? "Review updated!" : "Review submitted!");
      resetForm();
      // Re-fetch so Redux state refreshes: list, avg, and count update instantly
      dispatch(getReview({ id: doctorId }));
    } else {
      toast.error(result.payload || "Failed to save review");
    }
  };

  return (
    <div className="mt-3 space-y-3">

      {/* ── Overall Rating Summary ── */}
      {displayAvg > 0 && (
        <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Overall Rating</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-extrabold text-gray-800 leading-none">
              {displayAvg.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 mb-1">/ 5</span>
          </div>
          <StarDisplay rating={displayAvg} total={displayTotal} />
        </div>
      )}

      {/* ── Write / Edit Button — only shown when form is CLOSED ── */}
      {!showForm && (
        <button
          onClick={openForm}
          className="w-full flex items-center justify-center gap-2 py-2 px-3
                     bg-yellow-500 hover:bg-yellow-600 text-white font-semibold
                     rounded-lg transition-colors duration-200 text-xs sm:text-sm cursor-pointer"
        >
          {myReview ? (
            <><FaEdit className="w-3.5 h-3.5" /> Update Your Review</>
          ) : (
            <><FaCommentMedical className="w-3.5 h-3.5" /> Write a Review</>
          )}
        </button>
      )}

      {/* ── Review Form — only shown when user explicitly clicked above ── */}
      {showForm && (
        <div className="p-3 sm:p-4 bg-white border border-yellow-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              {myReview ? "Edit Your Review" : "Write a Review"}
            </h4>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Your Rating *</p>
              <StarPicker value={rating} onChange={setRating} />
              {!rating && <p className="text-xs text-red-400 mt-1">Please select a rating</p>}
            </div>

            {/* ── Scrollable comment textarea ── */}
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Comment *</p>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 pb-5 text-xs sm:text-sm
                             text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400
                             focus:border-transparent resize-none placeholder-gray-400 transition-all
                             overflow-y-auto"
                  style={{ minHeight: "80px", maxHeight: "120px" }}
                />
                <span className="absolute bottom-2 right-2.5 text-xs text-gray-300 select-none pointer-events-none">
                  {comment.length}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={reviewLoading || !rating || !comment.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500
                           hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm"
              >
                {reviewLoading
                  ? <FaSpinner className="animate-spin" />
                  : <><FaCheck className="w-3 h-3" /> {myReview ? "Update" : "Submit"}</>
                }
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-600 font-semibold
                           py-2 px-3 rounded-lg border border-gray-200 transition-colors text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Reviews List ── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {/* Show spinner inline while loading, then the real count */}
          Patient Reviews{" "}
          {reviewLoading
            ? <FaSpinner className="inline animate-spin text-yellow-400 ml-1" />
            : `(${displayTotal})`
          }
        </p>

        {reviewLoading ? (
          <div className="flex items-center justify-center py-6">
            <FaSpinner className="animate-spin text-yellow-400 text-2xl" />
          </div>
        ) : reviewList.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {reviewList.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                currentPatientId={currentPatientId}
                onEdit={openForm}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">
            No reviews yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
};

/* ── Main DoctorsTab ── */
export default function DoctorsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctor: doctors, loading, error } = useSelector((state) => state.patient);
  const currentPatientId = useSelector(
    (state) => state.auth?.user?._id || state.patients?.patient?._id,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [sortBy, setSortBy] = useState("experience");
  const [openReviewId, setOpenReviewId] = useState(null);

  useEffect(() => {
    dispatch(doctor());
  }, [dispatch]);

  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];
    let result = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.User_id?.Name?.toLowerCase().includes(query) ||
          doc.Specialization?.toLowerCase().includes(query),
      );
    }

    if (selectedSpecialty !== "All Specialties") {
      result = result.filter((doc) => doc.Specialization === selectedSpecialty);
    }

    if (sortBy === "experience") result.sort((a, b) => b.Experience - a.Experience);
    else if (sortBy === "name")
      result.sort((a, b) => a.User_id?.Name?.localeCompare(b.User_id?.Name || "") || 0);
    else if (sortBy === "specialization")
      result.sort((a, b) => a.Specialization?.localeCompare(b.Specialization || "") || 0);

    return result;
  }, [doctors, searchQuery, selectedSpecialty, sortBy]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-4xl sm:text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-red-200 mx-4">
          <div className="text-red-500 text-4xl sm:text-5xl mb-4">⚠️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Error Loading Doctors</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(doctor())}
            className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Find Your Doctor</h2>

      {/* Search + Controls */}
      <div className="mb-4 sm:mb-6 space-y-3">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-1 sm:flex-none text-sm cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2 text-sm" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
          <select
            className="px-3 sm:px-4 py-2 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none text-sm sm:text-base"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="experience">Experience</option>
            <option value="name">Name</option>
            <option value="specialization">Specialty</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 sm:mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            <button
              onClick={() => setSelectedSpecialty("All Specialties")}
              className="text-xs sm:text-sm text-green-600 hover:text-green-800 font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Specialty</label>
            <select
              className="w-full px-3 py-2 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mb-3 sm:mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length > 0 ? (
        <div className="grid gap-6
                        grid-rows-1">

          {filteredDoctors.map((doc) => {
            const isReviewOpen = openReviewId === doc._id;
            const avgRating    = doc.averageRating ?? 0;
            const totalReviews = doc.totalReviews ?? 0;

            return (
              <div
                key={doc._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100
                           hover:shadow-md transition-all duration-300
                           flex flex-col h-full"
              >

                <div className="p-5 flex flex-col flex-1">

                  {/* Doctor Header */}
                  <div className="flex items-start gap-4">

                    <div className="w-16 h-16 rounded-full
                                    bg-gradient-to-br from-green-400 to-green-600
                                    flex items-center justify-center
                                    text-white text-xl font-bold
                                    overflow-hidden flex-shrink-0">
                      {doc.User_id?.Image_url ? (
                        <img
                          src={doc.User_id.Image_url}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        doc.User_id?.Name?.charAt(0).toUpperCase() || "D"
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        Dr. {doc.User_id?.Name || "Unknown"}
                      </h3>

                      <p className="text-green-600 font-medium text-sm truncate mb-1">
                        {doc.Specialization}
                      </p>

                      {avgRating > 0 && (
                        <StarDisplay rating={avgRating} total={totalReviews} />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-sm text-gray-600 flex-1">

                    <p className="flex items-center gap-2">
                      <FaChartLine className="text-green-500" />
                      {doc.Experience} year{doc.Experience !== 1 ? "s" : ""} experience
                    </p>

                    {doc.Certificates && (
                      <p className="flex items-center gap-2">
                        <FaCertificate className="text-green-500" />
                        <a
                          href={doc.Certificates}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline truncate"
                        >
                          View Certificate
                        </a>
                      </p>
                    )}

                    <p className="flex items-center gap-2 text-xs text-gray-400">
                      <FaClock />
                      Joined: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">

                    <button
                      onClick={() => navigate(`/book-appointment/${doc._id}`)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700
                                 text-white font-semibold rounded-xl
                                 transition-all duration-200"
                    >
                      Book Appointment
                    </button>

                    <button
                      onClick={() => navigate(`/doctor/${doc._id}`)}
                      className="w-full py-2.5 rounded-xl
                                 border border-green-600
                                 text-green-600 font-medium
                                 hover:bg-green-50 transition-all"
                    >
                      <FaCalendarAlt className="inline mr-2" />
                      View Profile
                    </button>

                    <button
                      onClick={() => setOpenReviewId(isReviewOpen ? null : doc._id)}
                      className="w-full flex items-center justify-center gap-2
                                 bg-yellow-50 hover:bg-yellow-100
                                 text-yellow-700 border border-yellow-200
                                 font-semibold py-2.5 px-3 rounded-xl
                                 transition-all duration-200"
                    >
                      <FaStar className="text-yellow-400" />
                      {isReviewOpen ? "Hide Reviews" : "Reviews & Ratings"}
                      {isReviewOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {isReviewOpen && (
                      <div className="max-h-[450px] overflow-y-auto">
                        <ReviewsPanel
                          doctorId={doc._id}
                          avgRating={avgRating}
                          totalReviews={totalReviews}
                          currentPatientId={currentPatientId}
                        />
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm border border-gray-100 mx-4">
          <FaUserMd className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
          <p className="text-sm sm:text-base text-gray-500 px-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}