import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDietChart } from "../../feature/Doctor/doctor.thunk";
import { Leaf, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

  .dc-root {
    font-family: 'Outfit', sans-serif;
    background: #f0fdf4;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
  .dc-serif { font-family: 'Playfair Display', serif; }

  .dc-card {
    background: #fff;
    border-radius: 24px;
    border: 1.5px solid #dcfce7;
    box-shadow: 0 8px 40px rgba(22, 163, 74, 0.1);
    width: 100%;
    max-width: 480px;
    padding: 40px 36px;
  }

  .dc-input {
    width: 100%;
    border: 1.5px solid #d1fae5;
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #0f1f0f;
    background: #f0fdf4;
    transition: all 0.2s ease;
    box-sizing: border-box;
    outline: none;
    appearance: none;
  }
  .dc-input:focus {
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }
  .dc-input::placeholder { color: #a7f3d0; }

  .dc-label {
    font-size: 11px;
    font-weight: 600;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 7px;
    display: block;
  }

  .dc-btn {
    width: 100%;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(22, 163, 74, 0.35);
    transition: all 0.25s ease;
    margin-top: 28px;
  }
  .dc-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #15803d, #166534);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(22, 163, 74, 0.4);
  }
  .dc-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .dosha-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .dosha-option {
    padding: 10px;
    border-radius: 11px;
    border: 1.5px solid #d1fae5;
    background: #f0fdf4;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #4b7c4b;
    text-align: center;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .dosha-option:hover { background: #dcfce7; border-color: #86efac; }
  .dosha-option.selected {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border-color: #16a34a;
    color: #166534;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(22,163,74,0.2);
  }

  .gender-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .gender-option {
    padding: 10px;
    border-radius: 11px;
    border: 1.5px solid #d1fae5;
    background: #f0fdf4;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #4b7c4b;
    text-align: center;
    transition: all 0.2s ease;
  }
  .gender-option:hover { background: #dcfce7; border-color: #86efac; }
  .gender-option.selected {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border-color: #16a34a;
    color: #166534;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(22,163,74,0.2);
  }

  .field-group { margin-bottom: 20px; }

  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(16px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const DOSHAS = [
  { value: "vata", label: "Vata", emoji: "🌬️" },
  { value: "pitta", label: "Pitta", emoji: "🔥" },
  { value: "kapha", label: "Kapha", emoji: "🌊" },
  { value: "vata-pitta", label: "Vata-Pitta", emoji: "🌬️🔥" },
  { value: "pitta-kapha", label: "Pitta-Kapha", emoji: "🔥🌊" },
  { value: "vata-kapha", label: "Vata-Kapha", emoji: "🌬️🌊" },
];

const GENDERS = [
  { value: "male", label: "Male", emoji: "♂" },
  { value: "female", label: "Female", emoji: "♀" },
  { value: "other", label: "Other", emoji: "⚧" },
];

const CreateDietChart = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { loading } = useSelector((state) => state.doctor);

  const [form, setForm] = useState({ Email: "", Age: "", Gender: "male", Dosha: "vata" });
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!form.Email || !form.Age) {
      showToast("error", "Please fill in all fields.");
      return;
    }
    const result = await dispatch(createDietChart({ ...form, Age: Number(form.Age) }));
    if (createDietChart.fulfilled.match(result)) {
      showToast("success", "Diet chart created successfully!");
      setForm({ Email: "", Age: "", Gender: "male", Dosha: "vata" });
      navigate("/doctor-dashboard")
    } else {
      showToast("error", result.payload || "Something went wrong.");
    }
  };

  return (
    <div className="dc-root">
      <style>{styles}</style>

      {toast && (
        <div className="toast" style={{ background: toast.type === "success" ? "#f0fdf4" : "#fff5f5", border: `1.5px solid ${toast.type === "success" ? "#86efac" : "#fecaca"}` }}>
          {toast.type === "success"
            ? <Check style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0 }} />
            : <AlertCircle style={{ width: 16, height: 16, color: "#dc2626", flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 500, color: toast.type === "success" ? "#166534" : "#dc2626" }}>{toast.msg}</span>
        </div>
      )}

      <div className="dc-card">
      
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #16a34a, #15803d)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 6px 20px rgba(22,163,74,0.3)" }}>
            <Leaf style={{ width: 24, height: 24, color: "#fff" }} />
          </div>
          <h1 className="dc-serif" style={{ fontSize: 28, fontWeight: 600, color: "#0f1f0f", margin: "0 0 6px" }}>
            New Diet Chart
          </h1>
          <p style={{ color: "#4b7c4b", fontSize: 13, margin: 0 }}>Enter patient details to generate a personalized plan</p>
        </div>

    
        <div className="field-group">
          <label className="dc-label">Email Address</label>
          <input
            className="dc-input"
            type="email"
            placeholder="patient@email.com"
            value={form.Email}
            onChange={e => setForm(p => ({ ...p, Email: e.target.value }))}
          />
        </div>

    
        <div className="field-group">
          <label className="dc-label">Age</label>
          <input
            className="dc-input"
            type="number"
            placeholder="e.g. 32"
            min="1"
            max="120"
            value={form.Age}
            onChange={e => setForm(p => ({ ...p, Age: e.target.value }))}
          />
        </div>

      
        <div className="field-group">
          <label className="dc-label">Gender</label>
          <div className="gender-grid">
            {GENDERS.map(g => (
              <button
                key={g.value}
                className={`gender-option ${form.Gender === g.value ? "selected" : ""}`}
                onClick={() => setForm(p => ({ ...p, Gender: g.value }))}
              >
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

       
        <div className="field-group" style={{ marginBottom: 0 }}>
          <label className="dc-label">Dosha Type</label>
          <div className="dosha-grid">
            {DOSHAS.map(d => (
              <button
                key={d.value}
                className={`dosha-option ${form.Dosha === d.value ? "selected" : ""}`}
                onClick={() => setForm(p => ({ ...p, Dosha: d.value }))}
              >
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
        </div>

        
        <button className="dc-btn" onClick={handleSubmit} disabled={loading} >
          {loading ? (
            <><div className="spinner" />Creating Chart...</>
          ) : (
            <><Leaf style={{ width: 16, height: 16 }} />Create Diet Chart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateDietChart;