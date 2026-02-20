import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDietchart } from "../../feature/Doctor/doctor.thunk";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  FileText,
  Trash2,
  Send,
  Edit3,
  ChefHat,
  Leaf,
  User,
  Droplets,
  Clock,
  Activity,
  Flame,
  Zap,
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .diet-root {
    font-family: 'DM Sans', sans-serif;
    background: #faf8f4;
    min-height: 100vh;
  }
  .diet-display-font {
    font-family: 'Cormorant Garamond', serif;
  }
  .card-hover {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(139, 90, 43, 0.12);
  }
  .meal-section {
    position: relative;
    overflow: hidden;
  }
  .meal-section::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #d97706, #f59e0b, #fcd34d);
    border-radius: 0 2px 2px 0;
  }
  .expand-content {
    animation: slideDown 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .tag-pill {
    transition: all 0.2s ease;
  }
  .tag-pill:hover {
    transform: scale(1.05);
  }
  .search-input:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12);
  }
  .btn-primary {
    background: linear-gradient(135deg, #d97706, #b45309);
    transition: all 0.25s ease;
    box-shadow: 0 4px 14px rgba(180, 83, 9, 0.3);
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, #b45309, #92400e);
    box-shadow: 0 6px 20px rgba(180, 83, 9, 0.4);
    transform: translateY(-1px);
  }
  .nutrition-bar {
    height: 3px;
    border-radius: 2px;
    background: #e5e7eb;
    position: relative;
    overflow: hidden;
  }
  .nutrition-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .avatar-ring {
    background: conic-gradient(#d97706, #f59e0b, #fcd34d, #d97706);
    padding: 2px;
    border-radius: 50%;
  }
  .shimmer {
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .rotate-icon {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .rotate-icon.open {
    transform: rotate(180deg);
  }
  .filter-chip {
    transition: all 0.2s ease;
    border: 1.5px solid transparent;
  }
  .filter-chip.active {
    border-color: #d97706;
    background: linear-gradient(135deg, #fffbeb, #fef3c7);
  }
`;

const NutritionBar = ({ label, value, max, color }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{value}</span>
    </div>
    <div className="nutrition-bar">
      <div className="nutrition-bar-fill" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
    </div>
  </div>
);

const DietChartsTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getdietchart: dietCharts = [], loading, error } = useSelector((state) => state.doctor);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedChart, setExpandedChart] = useState(null);
  const [sortOption, setSortOption] = useState("recent");

  useEffect(() => {
    dispatch(getDietchart());
  }, [dispatch]);

  

  const getStatusStyle = (status) => {
    const map = {
      active: { bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
      pending: { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
      completed: { bg: "#dbeafe", color: "#1e40af", dot: "#2563eb" },
    };
    return map[status] || { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" };
  };

  const toggleChart = (id) => setExpandedChart(expandedChart === id ? null : id);

  const latestPerPatient = useMemo(() => {
    const map = new Map();
    [...dietCharts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((chart) => {
        const pid = chart.Patient_id?._id;
        if (pid && !map.has(pid)) map.set(pid, chart);
      });
    return Array.from(map.values());
  }, [dietCharts]);

  const filteredCharts = useMemo(() => {
    return latestPerPatient.filter((chart) => {
      const patientName = chart.Patient_id?.Name?.toLowerCase() || "";
      const matchesSearch = patientName.includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "all" || chart.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [latestPerPatient, searchQuery, selectedStatus]);

  const sortedCharts = useMemo(() => {
    let sorted = [...filteredCharts];
    if (sortOption === "recent") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortOption === "duration") sorted.sort((a, b) => b.duration_days - a.duration_days);
    return sorted;
  }, [filteredCharts, sortOption]);

  const avgDuration = dietCharts.length
    ? Math.round(dietCharts.reduce((acc, c) => acc + (c.duration_days || 0), 0) / dietCharts.length)
    : 0;

   

  if (loading) {
    return (
      <div className="diet-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <style>{styles}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <ChefHat style={{ width: 28, height: 28, color: "#d97706" }} />
          </div>
          <div className="shimmer" style={{ height: 12, width: 160, borderRadius: 6, margin: "0 auto 8px" }} />
          <div className="shimmer" style={{ height: 8, width: 100, borderRadius: 6, margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="diet-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <style>{styles}</style>
        <div style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
          <p style={{ color: "#b91c1c", fontWeight: 600, marginBottom: 6 }}>Unable to load diet charts</p>
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 20 }}>{error}</p>
          <button className="btn-primary" onClick={() => dispatch(getDietchart())} style={{ color: "#fff", border: "none", padding: "10px 24px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-root">
      <style>{styles}</style>

      <div style={{ padding: "32px 32px 0" }}>
        
        <div style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef9f0 50%, #faf8f4 100%)", borderRadius: 24, padding: "32px 36px", marginBottom: 28, border: "1px solid #fde68a", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: -30, left: "30%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #d97706, #b45309)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(180,83,9,0.3)" }}>
                  <Leaf style={{ width: 18, height: 18, color: "#fff" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ayurvedic Wellness</span>
              </div>
              <h1 className="diet-display-font" style={{ fontSize: 42, fontWeight: 600, color: "#1c1008", lineHeight: 1.1, marginBottom: 8 }}>
                Diet Charts
              </h1>
              <p style={{ color: "#78716c", fontSize: 15, fontWeight: 400 }}>Personalized plans rooted in ancient wisdom</p>
            </div>
            <button onClick={()=>{navigate("/doctor/createDietChart")}} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}>
              <Plus style={{ width: 16, height: 16 }}  />
              New Chart
            </button>
          </div>

         
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 28 }}>
            {[
              { label: "Total Charts", value: dietCharts.length, icon: <FileText style={{ width: 14, height: 14 }} />, color: "#d97706" },
              { label: "Active Plans", value: dietCharts.filter(c => c.status === "active").length, icon: <Activity style={{ width: 14, height: 14 }} />, color: "#059669" },
              { label: "Avg Duration", value: `${avgDuration}d`, icon: <Clock style={{ width: 14, height: 14 }} />, color: "#7c3aed" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#1c1008", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

       

      
        <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search style={{ width: 15, height: 15, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#d97706" }} />
            <input
              className="search-input"
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: "1.5px solid #e5e7eb", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, background: "#fff", color: "#374151", boxSizing: "border-box" }}
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}
          >
            <option value="recent">Most Recent</option>
            <option value="duration">By Duration</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#d97706", fontSize: 13 }}>
            <Leaf style={{ width: 14, height: 14 }} />
            <span style={{ fontWeight: 500 }}>{sortedCharts.length} charts</span>
          </div>
        </div>
      </div>

    
      <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {sortedCharts.map((chart) => {
          const patient = chart.Patient_id;
          const dailyPlan = chart.daily_plan || {};
          const lifestyle = chart.lifestyle || {};
          const isExpanded = expandedChart === chart._id;
          const statusStyle = getStatusStyle(chart.status);
          const meals = Object.entries(dailyPlan);

          return (
            <div key={chart._id} className="card-hover" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f3f0e8", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          
              <div style={{ height: 3, background: "linear-gradient(90deg, #d97706, #f59e0b, #fcd34d)" }} />

              <div style={{ padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }} onClick={() => toggleChart(chart._id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  {patient?.Image_url ? (
                    <div className="avatar-ring" style={{ flexShrink: 0, width: 52, height: 52 }}>
                      <img src={patient.Image_url} alt={patient.Name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                    </div>
                  ) : (
                    <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User style={{ width: 22, height: 22, color: "#d97706" }} />
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                      <h3 className="diet-display-font" style={{ fontSize: 20, fontWeight: 600, color: "#1c1008", margin: 0 }}>
                        {patient?.Name}
                      </h3>
                      {chart.status && (
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                          {chart.status}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{patient?.Age} yrs · {patient?.Gender}</span>
                      <span style={{ width: 1, height: 12, background: "#e5e7eb" }} />
                      <span style={{ fontSize: 12, color: "#d97706", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Clock style={{ width: 11, height: 11 }} />{chart.duration_days} day plan
                      </span>
                      <span style={{ width: 1, height: 12, background: "#e5e7eb" }} />
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        {new Date(chart.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>

         
                <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {lifestyle.Water_Intake && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#eff6ff", color: "#1d4ed8", padding: "5px 10px", borderRadius: 50, fontSize: 11, fontWeight: 500 }}>
                      <Droplets style={{ width: 11, height: 11 }} />{lifestyle.Water_Intake}
                    </div>
                  )}
                  {lifestyle.Meal_Frequency && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f0fdf4", color: "#166534", padding: "5px 10px", borderRadius: 50, fontSize: 11, fontWeight: 500 }}>
                      <ChefHat style={{ width: 11, height: 11 }} />{lifestyle.Meal_Frequency}
                    </div>
                  )}
                </div>

                <ChevronDown className={`rotate-icon ${isExpanded ? "open" : ""}`} style={{ width: 18, height: 18, color: "#d97706", flexShrink: 0 }} />
              </div>

         
              {!isExpanded && meals.length > 0 && (
                <div style={{ padding: "0 24px 20px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {meals.map(([mealKey, mealData]) => (
                    <div key={mealKey} style={{ background: "#faf8f4", border: "1px solid #f3f0e8", borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#d97706", fontWeight: 600, textTransform: "capitalize" }}>{mealKey}</span>
                      <span style={{ width: 1, height: 10, background: "#e5e7eb" }} />
                      <span style={{ fontSize: 11, color: "#6b7280" }}>{mealData.recipe_name}</span>
                    </div>
                  ))}
                </div>
              )}

             
              {isExpanded && (
                <div className="expand-content" style={{ borderTop: "1px solid #f3f0e8" }}>
                
                  <div style={{ padding: "24px 24px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText style={{ width: 13, height: 13, color: "#d97706" }} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#374151" }}>Daily Meal Plan</h4>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                      {meals.map(([mealKey, mealData]) => {
                        const n = mealData.nutrition || {};
                        const effects = mealData.ayurveda_effects || {};
                        return (
                          <div key={mealKey} className="meal-section" style={{ background: "#faf8f4", borderRadius: 14, padding: "16px 16px 16px 20px", border: "1px solid #f3f0e8" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.08em" }}>{mealKey}</span>
                                <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 600, color: "#1c1008" }}>{mealData.recipe_name}</p>
                              </div>
                              {n.calories && (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff", border: "1px solid #fde68a", borderRadius: 8, padding: "4px 8px" }}>
                                  <Flame style={{ width: 11, height: 11, color: "#f59e0b" }} />
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "#d97706" }}>{n.calories} cal</span>
                                </div>
                              )}
                            </div>

                            {(n.protein_g || n.carbs_g || n.fat_g) && (
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                                {n.protein_g && <NutritionBar label="Protein" value={n.protein_g} max={50} color="#10b981" />}
                                {n.carbs_g && <NutritionBar label="Carbs" value={n.carbs_g} max={100} color="#f59e0b" />}
                                {n.fat_g && <NutritionBar label="Fat" value={n.fat_g} max={40} color="#ef4444" />}
                              </div>
                            )}

                            {mealData.ingredients && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                                {mealData.ingredients.map((ing, i) => (
                                  <span key={i} className="tag-pill" style={{ background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: 50, fontSize: 10, fontWeight: 500, border: "1px solid #a7f3d0" }}>
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            )}

                            {mealData.instructions && (
                              <p style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.5 }}>{mealData.instructions}</p>
                            )}

                            {Object.keys(effects).length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {Object.entries(effects).map(([dosha, effect]) => (
                                  <span key={dosha} className="tag-pill" style={{ background: "#f5f3ff", color: "#6d28d9", padding: "3px 8px", borderRadius: 50, fontSize: 10, fontWeight: 500, border: "1px solid #ddd6fe" }}>
                                    <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{dosha}</span>: {effect}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                 
                  {chart.note && (
                    <div style={{ margin: "0 24px 20px", background: "linear-gradient(135deg, #fffbeb, #fef9f0)", border: "1px solid #fde68a", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Zap style={{ width: 13, height: 13, color: "#d97706" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#d97706", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Clinical Notes</div>
                        <p style={{ margin: 0, fontSize: 13, color: "#78716c", lineHeight: 1.6 }}>{chart.note}</p>
                      </div>
                    </div>
                  )}

                  
                  <div style={{ padding: "16px 24px 22px", borderTop: "1px solid #f9f7f2", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#fff", border: "none", padding: "9px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13 }}>
                      <Edit3 style={{ width: 13, height: 13 }} />
                      Edit Chart
                    </button>
                    <button
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", padding: "9px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, transition: "all 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                    >
                      <Send style={{ width: 13, height: 13 }} />
                      Send to Patient
                    </button>
                    <button
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff5f5", color: "#dc2626", border: "1.5px solid #fecaca", padding: "9px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, marginLeft: "auto", transition: "all 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; }}
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      
        {sortedCharts.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 32px", background: "#fff", borderRadius: 20, border: "1.5px dashed #fde68a" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ChefHat style={{ width: 30, height: 30, color: "#d97706" }} />
            </div>
            <h3 className="diet-display-font" style={{ fontSize: 24, fontWeight: 600, color: "#1c1008", marginBottom: 8 }}>No charts found</h3>
            <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>
              {searchQuery ? `No charts match "${searchQuery}"` : "Begin your journey with a new diet chart."}
            </p>
            <button onClick={()=>{navigate("/doctor/createDietChart")}} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14 }}>
              <Plus style={{ width: 15, height: 15 }} />
              Create New Chart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietChartsTab;