import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearDietchartById, clearUpdateStatus } from "../../feature/Doctor/doctor.slice";
import { getdietchartID, updateDietChartbyID } from "../../feature/Doctor/doctor.thunk";

// ─── Constants ────────────────────────────────────────────────────────────────

const emptyMeal = {
  recipe_name: "",
  ingredients: [],
  instructions: "",
  nutrition: { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 },
  ayurveda_effects: { vata: "", pitta: "", kapha: "" },
};

const emptyForm = {
  duration_days: 90,
  lifestyle: { Meal_Frequency: "", Bowel_Movement: "", Water_Intake: "" },
  daily_plan: {
    breakfast: { ...emptyMeal },
    lunch:     { ...emptyMeal },
    dinner:    { ...emptyMeal },
  },
  note: "",
};

const DOSHA_COLORS = { vata: "#2d6a4f", pitta: "#52b788", kapha: "#95d5b2" };

// merge API meal onto empty defaults so nutrition/ayurveda always exist
const normaliseMeal = (apiMeal = {}) => ({
  ...emptyMeal,
  ...apiMeal,
  nutrition:        { ...emptyMeal.nutrition,        ...(apiMeal.nutrition        ?? {}) },
  ayurveda_effects: { ...emptyMeal.ayurveda_effects, ...(apiMeal.ayurveda_effects ?? {}) },
  ingredients:      apiMeal.ingredients ?? [],
});

// ─── NutritionBadge ───────────────────────────────────────────────────────────

const NutritionBadge = ({ label, value, unit }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "linear-gradient(135deg, #f0faf4 0%, #e8f5e9 100%)",
    border: "1px solid #b7e4c7", borderRadius: "10px", padding: "8px 14px", minWidth: "64px",
  }}>
    <span style={{ fontSize: "15px", fontWeight: "700", color: "#1b4332" }}>{value}</span>
    <span style={{ fontSize: "10px", color: "#52b788", textTransform: "uppercase", letterSpacing: "0.5px" }}>{unit}</span>
    <span style={{ fontSize: "10px", color: "#74c69d", marginTop: "1px" }}>{label}</span>
  </div>
);

// ─── MealSection ──────────────────────────────────────────────────────────────

const MealSection = ({ mealKey, meal, onChange }) => {
  const [open, setOpen] = useState(true);
  const icons  = { breakfast: "🌅", lunch: "☀️", dinner: "🌙" };
  const labels = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

  const handleField       = (field, value) => onChange(mealKey, field, value);
  const handleNutrition = (key, value) => onChange(mealKey, "nutrition", { ...meal.nutrition, [key]: value === "" ? "" : parseInt(value, 10) });
  const handleAyurveda    = (key, value)   => onChange(mealKey, "ayurveda_effects", { ...meal.ayurveda_effects, [key]: value });
  const handleIngredients = (value)        => handleField("ingredients", value.split(",").map(s => s.trim()));

  return (
    <div style={{ border: "1.5px solid #b7e4c7", borderRadius: "16px", overflow: "hidden", marginBottom: "18px", boxShadow: "0 2px 12px rgba(45,106,79,0.07)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 22px", background: open ? "linear-gradient(90deg,#d8f3dc,#f0faf4)" : "#f9fefb",
          border: "none", cursor: "pointer", outline: "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>{icons[mealKey]}</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#1b4332", fontFamily: "'Playfair Display', serif" }}>
            {labels[mealKey]}
          </span>
          {meal.recipe_name && (
            <span style={{ fontSize: "13px", color: "#52b788", fontStyle: "italic" }}>— {meal.recipe_name}</span>
          )}
        </span>
        <span style={{ color: "#52b788", fontSize: "18px", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: "20px 22px", background: "#fff" }}>
          {/* Recipe name + Ingredients */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>Recipe Name</label>
              <input style={inputStyle} value={meal.recipe_name || ""} placeholder="e.g. Oats Porridge"
                onChange={e => handleField("recipe_name", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>
                Ingredients <span style={{ color: "#95d5b2", fontSize: "11px" }}>(comma separated)</span>
              </label>
              <input style={inputStyle} value={(meal.ingredients || []).join(", ")} placeholder="e.g. Oats, Milk, Banana"
                onChange={e => handleIngredients(e.target.value)} />
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Instructions</label>
            <textarea style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
              value={meal.instructions || ""} placeholder="Step-by-step cooking instructions..."
              onChange={e => handleField("instructions", e.target.value)} />
          </div>

          {/* Nutrition */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ ...labelStyle, display: "block", marginBottom: "10px" }}>🥗 Nutrition</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["calories", "protein_g", "carbs_g", "fat_g", "fiber_g"].map(key => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                  <NutritionBadge
                    label={key.replace("_g", "")}
                    value={meal.nutrition?.[key] ?? 0}
                    unit={key.includes("_g") ? "g" : "kcal"}
                  />
                  <input
                    type="number"
                    style={{ ...inputStyle, width: "72px", textAlign: "center", padding: "4px 6px", fontSize: "12px" }}
                    value={meal.nutrition?.[key] ?? ""}
                    onChange={e => handleNutrition(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ayurveda */}
          <div>
            <label style={{ ...labelStyle, display: "block", marginBottom: "10px" }}>🌿 Ayurveda Effects</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {["vata", "pitta", "kapha"].map(dosha => (
                <div key={dosha}>
                  <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: DOSHA_COLORS[dosha], display: "block", marginBottom: "4px" }}>
                    {dosha}
                  </label>
                  <input
                    style={{ ...inputStyle, borderColor: DOSHA_COLORS[dosha] + "80" }}
                    value={meal.ayurveda_effects?.[dosha] || ""}
                    placeholder={`Effect on ${dosha}`}
                    onChange={e => handleAyurveda(dosha, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", padding: "9px 13px", borderRadius: "9px",
  border: "1.5px solid #b7e4c7", fontSize: "14px", color: "#1b4332",
  background: "#f9fefb", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: "12px", fontWeight: "600", color: "#2d6a4f",
  textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "5px", display: "block",
};

const sectionHeading = {
  fontSize: "18px", fontWeight: "700", color: "#1b4332",
  fontFamily: "'Playfair Display', serif", marginBottom: "18px",
  paddingBottom: "10px", borderBottom: "2px solid #d8f3dc",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditDietChart() {
  const { id }   = useParams();   // diet chart ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Read from Redux store (slice name is "Doctors" in your slice) ──
  const {
    getDietchartById,
    loading,
    error,
    updateLoading,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.doctor); // matches store key: doctor

  const [form,      setForm]      = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("lifestyle");

  // ── STEP 1: Page opens → dispatch getdietchartID(id) ──────────────
  useEffect(() => {
    if (id) {
      dispatch(getdietchartID(id));
    }
    // cleanup: reset update toast when leaving page
    return () => {
      dispatch(clearUpdateStatus());
    };
  }, [id, dispatch]);



  // ── STEP 2: Store updates → populate the form ─────────────────────
  useEffect(() => {
    if (!getDietchartById) return;

    const d = getDietchartById;
    setForm({
      duration_days: d.duration_days ?? 90,
      lifestyle: {
        Meal_Frequency: d.lifestyle?.Meal_Frequency ?? "",
        Bowel_Movement: d.lifestyle?.Bowel_Movement ?? "",
        Water_Intake:   d.lifestyle?.Water_Intake   ?? "",
      },
      daily_plan: {
        breakfast: normaliseMeal(d.daily_plan?.breakfast),
        lunch:     normaliseMeal(d.daily_plan?.lunch),
        dinner:    normaliseMeal(d.daily_plan?.dinner),
      },
      note: d.note ?? "",
    });
  }, [getDietchartById]);

  // ── STEP 3: Auto-dismiss success toast after 2.5s ─────────────────
  useEffect(() => {
    if (!updateSuccess) return;
    const t = setTimeout(() => dispatch(clearUpdateStatus()), 2500);
    return () => clearTimeout(t);
  }, [updateSuccess, dispatch]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleLifestyle = (key, value) =>
    setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, [key]: value } }));

  const handleMeal = (mealKey, field, value) =>
    setForm(f => ({
      ...f,
      daily_plan: {
        ...f.daily_plan,
        [mealKey]: { ...f.daily_plan[mealKey], [field]: value },
      },
    }));

  // ── STEP 4: Doctor clicks Save → dispatch updateDietChartbyID ─────
 const handleSave = () => {
  dispatch(updateDietChartbyID({
    id,
    formData: {
      duration_days: form.duration_days,
      lifestyle:     form.lifestyle,
      daily_plan:    form.daily_plan,
      note:          form.note,
    },
  }))
    .unwrap()
    .then(() => {
      // ✅ spinner shows during API call, navigate only after success
      navigate("/doctor-dashboard");
    })
    .catch((err) => {
      console.log("Save failed:", err);
    });
};
  // ── Loading screen (while fetching) ───────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0faf4" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "48px", height: "48px", border: "4px solid #b7e4c7",
          borderTop: "4px solid #2d6a4f", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <p style={{ color: "#2d6a4f", fontWeight: "600" }}>Loading diet chart…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  // ── Error screen (if fetch failed) ────────────────────────────────
  if (error && !getDietchartById) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0faf4" }}>
      <div style={{ textAlign: "center", background: "#fff", padding: "40px", borderRadius: "16px", border: "1.5px solid #b7e4c7", maxWidth: "380px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <p style={{ color: "#1b4332", fontWeight: "700", fontSize: "16px", marginBottom: "8px" }}>Could not load chart</p>
        <p style={{ color: "#74c69d", fontSize: "14px", marginBottom: "20px" }}>{error}</p>
        <button onClick={() => navigate(-1)} style={{
          padding: "10px 24px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #2d6a4f, #40916c)",
          color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "14px",
        }}>Go Back</button>
      </div>
    </div>
  );

  const tabs      = ["lifestyle", "daily_plan", "notes"];
  const tabLabels = { lifestyle: "🌱 Lifestyle", daily_plan: "🍽 Daily Plan", notes: "📋 Notes" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0faf4 0%, #ffffff 60%, #e8f5e9 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)", padding: "28px 40px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <button onClick={() => navigate(-1)} style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px",
              padding: "5px 12px", color: "#d8f3dc", fontSize: "13px", cursor: "pointer", fontWeight: "500",
            }}>← Back</button>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", color: "#d8f3dc", fontWeight: "500" }}>
              Diet Chart Editor
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: "#fff", fontFamily: "'Playfair Display', serif" }}>
            Edit Patient Diet Chart
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#95d5b2" }}>
            {getDietchartById?.Patient_id?.Name
              ? `Patient: ${getDietchartById.Patient_id.Name} · ${form.duration_days} days plan`
              : "Modify lifestyle, meal plans and clinical notes"}
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: "#fff", borderBottom: "2px solid #d8f3dc", padding: "0 40px", display: "flex", gap: "4px" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "14px 20px", border: "none", cursor: "pointer",
            fontSize: "14px", fontWeight: activeTab === tab ? "700" : "500",
            color: activeTab === tab ? "#1b4332" : "#74c69d", background: "transparent",
            borderBottom: activeTab === tab ? "3px solid #2d6a4f" : "3px solid transparent",
            marginBottom: "-2px", transition: "all 0.2s",
          }}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 40px 100px" }}>

        {/* LIFESTYLE */}
        {activeTab === "lifestyle" && (
          <div>
            <h2 style={sectionHeading}>Lifestyle Habits</h2>

            {/* Duration */}
            <div style={{ background: "#fff", border: "1.5px solid #b7e4c7", borderRadius: "14px", padding: "18px 20px", marginBottom: "18px", boxShadow: "0 2px 8px rgba(45,106,79,0.06)" }}>
              <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <span>📅</span> Duration (days)
              </label>
              <input
                type="number"
                style={{ ...inputStyle, maxWidth: "160px" }}
                value={form.duration_days}
                placeholder="e.g. 90"
                onChange={e => setForm(f => ({ ...f, duration_days: Number(e.target.value) }))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              {[
                { key: "Meal_Frequency", label: "Meal Frequency", icon: "🍴", placeholder: "e.g. 3 meals per day" },
                { key: "Water_Intake",   label: "Water Intake",   icon: "💧", placeholder: "e.g. 2.5L per day" },
                { key: "Bowel_Movement", label: "Bowel Movement", icon: "🔄", placeholder: "e.g. Regular / Irregular" },
              ].map(({ key, label, icon, placeholder }) => (
                <div key={key} style={{ background: "#fff", border: "1.5px solid #b7e4c7", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(45,106,79,0.06)" }}>
                  <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                    <span>{icon}</span> {label}
                  </label>
                  <input style={inputStyle} value={form.lifestyle[key] || ""} placeholder={placeholder}
                    onChange={e => handleLifestyle(key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAILY PLAN */}
        {activeTab === "daily_plan" && (
          <div>
            <h2 style={sectionHeading}>Daily Meal Plan</h2>
            {["breakfast", "lunch", "dinner"].map(mealKey => (
              <MealSection key={mealKey} mealKey={mealKey} meal={form.daily_plan[mealKey]} onChange={handleMeal} />
            ))}
          </div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div>
            <h2 style={sectionHeading}>Clinical Notes</h2>
            <div style={{ background: "#fff", border: "1.5px solid #b7e4c7", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(45,106,79,0.07)" }}>
              <label style={{ ...labelStyle, marginBottom: "10px", display: "block" }}>📋 Doctor's Notes & Recommendations</label>
              <textarea
                style={{ ...inputStyle, minHeight: "180px", resize: "vertical", fontSize: "15px", lineHeight: "1.7" }}
                value={form.note || ""}
                placeholder="Add dietary recommendations, contraindications, or special instructions..."
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              />
              <div style={{ marginTop: "12px", padding: "12px 16px", background: "#f0faf4", borderRadius: "10px", borderLeft: "4px solid #52b788", fontSize: "13px", color: "#2d6a4f" }}>
                💡 Tip: Mention allergens, food intolerances, or Ayurvedic dosha-specific recommendations here.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Save Bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        borderTop: "1.5px solid #d8f3dc", padding: "14px 40px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "14px",
        boxShadow: "0 -4px 24px rgba(45,106,79,0.1)",
      }}>
        {updateError && (
          <span style={{ background: "#fff0f0", color: "#c0392b", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
            ⚠ {updateError}
          </span>
        )}
        {updateSuccess && (
          <span style={{ background: "#d8f3dc", color: "#1b4332", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
            ✓ Diet chart updated successfully
          </span>
        )}
        <button onClick={() => navigate(-1)} style={{
          padding: "11px 22px", borderRadius: "10px", border: "1.5px solid #b7e4c7",
          background: "#fff", color: "#2d6a4f", fontWeight: "600", cursor: "pointer", fontSize: "14px",
        }}>Discard</button>
        <button
  onClick={handleSave}
  disabled={updateLoading}
  style={{
    padding: "11px 28px", borderRadius: "10px", border: "none",
    background: updateLoading ? "#74c69d" : "linear-gradient(135deg, #2d6a4f, #40916c)",
    color: "#fff", fontWeight: "700", cursor: updateLoading ? "not-allowed" : "pointer", fontSize: "14px",
    boxShadow: "0 4px 14px rgba(45,106,79,0.3)", transition: "transform 0.15s, box-shadow 0.15s",
    display: "flex", alignItems: "center", gap: "8px",
  }}
  onMouseEnter={e => { if (!updateLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,106,79,0.4)"; } }}
  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,79,0.3)"; }}
>
  {updateLoading ? (
    // ✅ spinner + "Saving..." while API is in flight
    <>
      <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
      Saving…
    </>
  ) : (
    // ✅ normal state
    "Save Changes"
  )}
</button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}