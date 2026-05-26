import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCertificate,
  FaChartLine,
  FaCalendarAlt,
  FaSpinner,
  FaStethoscope,
  FaArrowLeft,
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
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 gap-4">
        <FaSpinner className="animate-spin text-4xl text-emerald-600" />
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          Loading Profile…
        </p>
      </div>
    );
  }

  const doc = singleDoctor;
  const initial = doc.User_id?.Name?.charAt(0)?.toUpperCase() ?? "D";
  const joinDate = new Date(doc.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dp-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }

        /* ── Hero banner ── */
        .dp-hero {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 2.5rem 1.5rem 5rem;
          position: relative;
          overflow: hidden;
        }
        .dp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 60% at 80% -10%, rgba(52,211,153,.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at -5% 80%, rgba(16,185,129,.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .dp-hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .dp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          color: rgba(255,255,255,.75);
          font-size: .85rem;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 2rem;
          transition: color .2s;
        }
        .dp-back-btn:hover { color: #fff; }

        /* ── Avatar ── */
        .dp-avatar-ring {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6ee7b7, #059669);
          padding: 3px;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
        }
        .dp-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #065f46, #047857);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -.02em;
        }

        .dp-badge {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          backdrop-filter: blur(6px);
          color: #a7f3d0;
          font-size: .75rem;
          font-weight: 600;
          padding: .3rem .75rem;
          border-radius: 999px;
          letter-spacing: .04em;
          text-transform: uppercase;
          margin-bottom: .65rem;
        }
        .dp-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 .25rem;
        }
        .dp-spec {
          font-size: .95rem;
          color: #6ee7b7;
          font-weight: 500;
          margin: 0;
        }

        /* ── Card body ── */
        .dp-card {
          max-width: 780px;
          margin: -3rem auto 0;
          padding: 0 1rem 2.5rem;
          position: relative;
          z-index: 10;
        }

        .dp-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,.08);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .dp-stat {
          padding: 1.25rem 1rem;
          text-align: center;
          border-right: 1px solid #f1f5f9;
        }
        .dp-stat:last-child { border-right: none; }
        .dp-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #064e3b;
          line-height: 1;
        }
        .dp-stat-label {
          font-size: .72rem;
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-top: .35rem;
        }

        .dp-section {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,.06);
          margin-bottom: 1.25rem;
        }
        .dp-section-title {
          font-size: .7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: #94a3b8;
          margin: 0 0 1rem;
        }

        .dp-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: .75rem;
        }
        @media (max-width: 480px) {
          .dp-info-grid { grid-template-columns: 1fr; }
          .dp-stats-row { grid-template-columns: repeat(3, 1fr); }
          .dp-stat-value { font-size: 1.2rem; }
        }

        .dp-info-pill {
          display: flex;
          align-items: center;
          gap: .65rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: .75rem 1rem;
          font-size: .88rem;
          color: #334155;
          font-weight: 500;
          transition: border-color .2s, box-shadow .2s;
        }
        .dp-info-pill:hover {
          border-color: #6ee7b7;
          box-shadow: 0 0 0 3px rgba(110,231,183,.15);
        }
        .dp-info-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          font-size: .85rem;
          flex-shrink: 0;
        }
        .dp-cert-link {
          color: #059669;
          text-decoration: none;
          font-weight: 600;
        }
        .dp-cert-link:hover { text-decoration: underline; }

        .dp-about-text {
          font-size: .93rem;
          color: #475569;
          line-height: 1.75;
          margin: 0;
        }

        /* ── CTA ── */
        .dp-book-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: .02em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          box-shadow: 0 6px 20px rgba(5,150,105,.35);
          transition: transform .18s, box-shadow .18s, filter .18s;
          position: relative;
          overflow: hidden;
        }
        .dp-book-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.12), transparent);
          pointer-events: none;
        }
        .dp-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(5,150,105,.45);
          filter: brightness(1.05);
        }
        .dp-book-btn:active { transform: translateY(0); }

        /* ── Rating stars ── */
        .dp-stars {
          display: flex;
          gap: 2px;
          color: #f59e0b;
          font-size: .8rem;
        }
      `}</style>

      <div className="dp-root">
        {/* ── Hero ── */}
        <div className="dp-hero">
          <div className="dp-hero-dots" />
          <div
            style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}
          >
            <button className="dp-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft size={12} /> Back
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <div className="dp-avatar-ring">
                {doc.User_id?.Image_url ? (
                  <img
                    src={doc.User_id?.Image_url}
                    alt={`Dr. ${doc.User_id?.Name}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div className="dp-avatar-inner">{initial}</div>
                )}
              </div>

              <div>
                <div className="dp-badge">
                  <FaStethoscope size={10} />
                  Verified Doctor
                </div>
                <h1 className="dp-name">Dr. {doc.User_id?.Name}</h1>
                <p className="dp-spec">{doc.Specialization}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="dp-card">
          {/* Info pills */}
          <div className="dp-section">
            <p className="dp-section-title">Doctor Details</p>
            <div className="dp-info-grid">
              <div className="dp-info-pill">
                <div className="dp-info-icon">
                  <FaChartLine />
                </div>
                <span>{doc.Experience} Years Experience</span>
              </div>

              <div className="dp-info-pill">
                <div className="dp-info-icon">
                  <FaCalendarAlt />
                </div>
                <span>Joined {joinDate}</span>
              </div>

              {doc.Certificates && (
                <div className="dp-info-pill" style={{ gridColumn: "1 / -1" }}>
                  <div className="dp-info-icon">
                    <FaCertificate />
                  </div>
                  <a
                    href={doc.Certificates}
                    target="_blank"
                    rel="noreferrer"
                    className="dp-cert-link"
                  >
                    View Certificate ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="dp-section">
            <p className="dp-section-title">About</p>
            <p className="dp-about-text">
              Dr. {doc.User_id?.Name} is an experienced specialist in{" "}
              <strong style={{ color: "#064e3b" }}>{doc.Specialization}</strong>{" "}
              with {doc.Experience} years of clinical practice. Dedicated to
              providing compassionate, evidence-based care and building lasting
              relationships with patients for better long-term health outcomes.
            </p>
          </div>

          {/* CTA */}
          <button
            className="dp-book-btn"
            onClick={() => navigate(`/book-appointment/${doc._id}`)}
          >
            <FaCalendarAlt size={16} />
            Book an Appointment
          </button>
        </div>
      </div>
    </>
  );
}
