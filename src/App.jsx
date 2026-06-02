import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ndwocrqtgzalyurluzjw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd29jcnF0Z3phbHl1cmx1emp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjQ1NjAsImV4cCI6MjA5NTcwMDU2MH0.GDhB9kyvS_ZBSJFviNU_EzsXtd_-XUyb8cl_UqDu_PU"
);

const MEALS_DB = {
  desayuno: {
    label: "Desayuno", emoji: "🌅", target: 500, color: "#F59E0B",
    options: [
      { id: "d1", name: "Avena + Proteína + Fruta", kcal: 430,
        items: ["60g avena → ~230 kcal", "30g proteína → ~120 kcal", "100g fruta → ~80 kcal"],
        macros: { p: 35, c: 58, g: 10 } },
      { id: "d2", name: "Huevos + Pan Integral", kcal: 450,
        items: ["2 huevos + 200g claras → ~220 kcal", "60g pan integral → ~150 kcal", "1 fruta → ~80 kcal"],
        macros: { p: 42, c: 40, g: 12 } },
      { id: "d3", name: "Yogur + Avena", kcal: 380,
        items: ["250g yogur o skyr → ~150 kcal", "40g avena → ~150 kcal", "Fruta → ~80 kcal"],
        macros: { p: 28, c: 55, g: 8 } },
      { id: "d4", name: "Tortitas de Proteína", kcal: 420,
        items: ["3 huevos → ~210 kcal", "30g proteína en polvo → ~120 kcal", "100g plátano → ~90 kcal"],
        macros: { p: 38, c: 42, g: 10 } },
    ]
  },
  comida: {
    label: "Comida", emoji: "☀️", target: 750, color: "#10B981",
    options: [
      { id: "c1", name: "Pollo + Arroz + Verduras", kcal: 760,
        items: ["180g pollo → ~300 kcal", "90g arroz en crudo → ~320 kcal", "Verduras + 10g aceite → ~140 kcal"],
        macros: { p: 52, c: 75, g: 14 } },
      { id: "c2", name: "Ternera + Patata", kcal: 590,
        items: ["150g carne magra → ~250 kcal", "250g patata → ~200 kcal", "Verduras + aceite → ~140 kcal"],
        macros: { p: 45, c: 55, g: 16 } },
      { id: "c3", name: "Pasta + Pollo", kcal: 650,
        items: ["80g pasta → ~300 kcal", "180g pollo o pavo → ~300 kcal", "Verduras → ~50 kcal"],
        macros: { p: 50, c: 70, g: 8 } },
      { id: "c4", name: "Salmón + Arroz + Aguacate", kcal: 720,
        items: ["180g salmón → ~360 kcal", "80g arroz en crudo → ~285 kcal", "50g aguacate → ~75 kcal"],
        macros: { p: 48, c: 55, g: 28 } },
    ]
  },
  merienda: {
    label: "Merienda", emoji: "🌤️", target: 350, color: "#8B5CF6",
    options: [
      { id: "m1", name: "Yogur + Fruta + Frutos Secos", kcal: 300,
        items: ["200g yogur → ~140 kcal", "1 fruta → ~80 kcal", "Frutos secos → ~80 kcal"],
        macros: { p: 18, c: 30, g: 12 } },
      { id: "m2", name: "Tortitas de Arroz + Proteína", kcal: 240,
        items: ["3-4 tortitas → ~120 kcal", "80g pavo o atún → ~120 kcal"],
        macros: { p: 22, c: 28, g: 4 } },
      { id: "m3", name: "Batido de Proteína", kcal: 200,
        items: ["30g proteína → ~120 kcal", "1 fruta → ~80 kcal"],
        macros: { p: 30, c: 20, g: 2 } },
      { id: "m4", name: "Pan Integral + Aguacate + Atún", kcal: 380,
        items: ["60g pan integral → ~150 kcal", "70g aguacate → ~112 kcal", "80g atún → ~118 kcal"],
        macros: { p: 28, c: 35, g: 14 } },
    ]
  },
  cena: {
    label: "Cena", emoji: "🌙", target: 550, color: "#3B82F6",
    options: [
      { id: "ce1", name: "Pescado + Patata + Verduras", kcal: 550,
        items: ["180g pescado → ~250 kcal", "200g patata → ~160 kcal", "Verduras + aceite → ~140 kcal"],
        macros: { p: 45, c: 50, g: 12 } },
      { id: "ce2", name: "Tortilla + Ensalada", kcal: 490,
        items: ["2 huevos + 200g claras → ~220 kcal", "Ensalada + 50g aguacate → ~120 kcal", "60g pan → ~150 kcal"],
        macros: { p: 40, c: 38, g: 18 } },
      { id: "ce3", name: "Carne Magra + Verduras + Carbohidrato", kcal: 500,
        items: ["150g carne magra → ~250 kcal", "Verduras → ~50 kcal", "60g arroz o 200g patata → ~200 kcal"],
        macros: { p: 42, c: 48, g: 10 } },
      { id: "ce4", name: "Merluza + Arroz + Brócoli", kcal: 480,
        items: ["200g merluza → ~200 kcal", "70g arroz en crudo → ~250 kcal", "150g brócoli + aceite → ~80 kcal"],
        macros: { p: 48, c: 52, g: 8 } },
    ]
  }
};

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  return `fitplan-${startOfWeek.toISOString().split("T")[0]}`;
};

const getTodayIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

export default function App() {
  const [plan, setPlan] = useState({});
  const [completed, setCompleted] = useState({});
  const [selectedDay, setSelectedDay] = useState(getTodayIndex());
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);
  const weekKey = getWeekKey();

  const loadData = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("meal_plan")
        .select("value")
        .eq("key", weekKey)
        .maybeSingle();
      if (data?.value) {
        setPlan(data.value.plan || {});
        setCompleted(data.value.completed || {});
      }
    } catch (e) { console.log("Starting fresh"); }
    setLoading(false);
  }, [weekKey]);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("fitplan_sync")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "meal_plan",
        filter: `key=eq.${weekKey}`
      }, (payload) => {
        if (payload.new?.value) {
          setPlan(payload.new.value.plan || {});
          setCompleted(payload.new.value.completed || {});
          setSynced(true);
          setTimeout(() => setSynced(false), 2000);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadData, weekKey]);

  const saveData = async (newPlan, newCompleted) => {
    setSaving(true);
    try {
      await supabase.from("meal_plan").upsert({
        key: weekKey,
        value: { plan: newPlan, completed: newCompleted },
        updated_at: new Date().toISOString()
      });
    } catch (e) { console.error("Save error:", e); }
    setSaving(false);
  };

  const selectOption = (meal, optionId) => {
    const newPlan = { ...plan, [`${selectedDay}-${meal}`]: optionId };
    const newCompleted = { ...completed };
    delete newCompleted[`${selectedDay}-${meal}`];
    setPlan(newPlan);
    setCompleted(newCompleted);
    saveData(newPlan, newCompleted);
    setActiveModal(null);
  };

  const toggleComplete = (meal) => {
    const key = `${selectedDay}-${meal}`;
    const newCompleted = { ...completed, [key]: !completed[key] };
    setCompleted(newCompleted);
    saveData(plan, newCompleted);
  };

  const getDayKcal = (dayIdx) => {
    let total = 0;
    Object.keys(MEALS_DB).forEach(meal => {
      const optId = plan[`${dayIdx}-${meal}`];
      if (optId) {
        const opt = MEALS_DB[meal].options.find(o => o.id === optId);
        if (opt) total += opt.kcal;
      }
    });
    return total;
  };

  const dayTarget = Object.values(MEALS_DB).reduce((s, m) => s + m.target, 0);
  const dayKcal = getDayKcal(selectedDay);
  const selectedOption = (meal) => {
    const optId = plan[`${selectedDay}-${meal}`];
    return optId ? MEALS_DB[meal].options.find(o => o.id === optId) : null;
  };

  if (loading) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 56 }}>🔥</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 28, color: "#4ade80", letterSpacing: 3, fontWeight: 900 }}>FITPLAN</div>
        <p style={{ color: "#6B7280", fontSize: 13, fontFamily: "sans-serif" }}>Cargando tu plan...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0F; }
        .meal-card { transition: all 0.2s ease; }
        .day-btn { transition: all 0.15s ease; }
        .opt-card { transition: all 0.15s ease; cursor: pointer; }
        .opt-card:active { transform: scale(0.98); }
        .check-btn { transition: all 0.2s; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.3s ease; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #0D1117 0%, #111827 100%)", borderBottom: "1px solid #1F2937", padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: 3, color: "#4ade80", lineHeight: 1 }}>FITPLAN</h1>
              <p style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}>Plan nutricional semanal</p>
            </div>
            <div style={{ textAlign: "right" }}>
              {synced && <div style={{ fontSize: 10, color: "#4ade80", marginBottom: 4 }}>✓ Sincronizado</div>}
              {saving && <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>Guardando...</div>}
              <div style={{ fontSize: 24, fontWeight: 800, color: dayKcal > 0 ? "#4ade80" : "#374151", lineHeight: 1 }}>{dayKcal > 0 ? dayKcal : "—"}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>/ {dayTarget} kcal</div>
            </div>
          </div>
          <div style={{ height: 3, background: "#1F2937", borderRadius: 2, marginBottom: 14 }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #4ade80, #22d3ee)", borderRadius: 2, width: `${Math.min((dayKcal / dayTarget) * 100, 100)}%`, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 4, paddingBottom: 14, overflowX: "auto" }}>
            {DAYS.map((day, i) => {
              const isToday = i === getTodayIndex();
              const isSelected = i === selectedDay;
              const kcal = getDayKcal(i);
              return (
                <button key={i} className="day-btn" onClick={() => setSelectedDay(i)}
                  style={{ flex: "0 0 auto", width: 58, padding: "10px 4px", borderRadius: 12,
                    background: isSelected ? "#4ade80" : isToday ? "#0f2d1f" : "transparent",
                    border: `1px solid ${isSelected ? "#4ade80" : isToday ? "#4ade80" : "#1F2937"}`,
                    color: isSelected ? "#000" : "#fff", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, opacity: isSelected ? 1 : 0.6, marginBottom: 4 }}>{day}</div>
                  {kcal > 0
                    ? <div style={{ fontSize: 9, fontWeight: 700, color: isSelected ? "#065f46" : "#4ade80" }}>{kcal}<br />kcal</div>
                    : <div style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#065f46" : "#374151", margin: "0 auto" }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 100px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{DAYS_FULL[selectedDay]}</h2>
        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 18 }}>
          {Object.keys(MEALS_DB).filter(m => plan[`${selectedDay}-${m}`]).length} de 4 comidas planificadas
        </p>

        {Object.entries(MEALS_DB).map(([mealKey, meal]) => {
          const opt = selectedOption(mealKey);
          const isDone = completed[`${selectedDay}-${mealKey}`];
          return (
            <div key={mealKey} style={{ marginBottom: 10 }}>
              <div className="meal-card fade-in" onClick={() => !isDone && setActiveModal(mealKey)}
                style={{ background: isDone ? "linear-gradient(135deg,#052e16,#0a1f14)" : opt ? "linear-gradient(135deg,#111827,#1a2235)" : "#111",
                  border: `1px solid ${isDone ? "#166534" : opt ? meal.color + "40" : "#1F2937"}`,
                  borderRadius: 16, padding: 16, position: "relative", overflow: "hidden", cursor: isDone ? "default" : "pointer" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isDone ? "#4ade80" : opt ? meal.color : "#1F2937", borderRadius: "16px 0 0 16px" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ fontSize: 26, lineHeight: 1, marginTop: 2 }}>{meal.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: meal.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{meal.label}</span>
                        <span style={{ fontSize: 10, color: "#6B7280", marginLeft: 6 }}>~{meal.target} kcal</span>
                      </div>
                      {opt && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: isDone ? "#4ade80" : "#F9FAFB" }}>{opt.kcal} kcal</span>
                          <button className="check-btn" onClick={e => { e.stopPropagation(); toggleComplete(mealKey); }}
                            style={{ width: 30, height: 30, borderRadius: 8, background: isDone ? "#4ade80" : "transparent",
                              border: `2px solid ${isDone ? "#4ade80" : "#374151"}`, color: isDone ? "#000" : "#6B7280",
                              cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                            {isDone ? "✓" : "○"}
                          </button>
                        </div>
                      )}
                    </div>
                    {opt ? (
                      <>
                        <p style={{ fontWeight: 600, color: isDone ? "#6EE7B7" : "#F9FAFB", fontSize: 14, marginBottom: 8 }}>{opt.name}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {[{ l: "P", v: opt.macros.p, c: "#3B82F6" }, { l: "C", v: opt.macros.c, c: "#F59E0B" }, { l: "G", v: opt.macros.g, c: "#EF4444" }].map(m => (
                            <div key={m.l} style={{ fontSize: 11, color: m.c, background: m.c + "18", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{m.l} {m.v}g</div>
                          ))}
                          {!isDone && <span style={{ fontSize: 11, color: "#4B5563", marginLeft: "auto", alignSelf: "center" }}>cambiar →</span>}
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#374151" }} />
                        <span style={{ fontSize: 13, color: "#4B5563" }}>Sin planificar — toca para elegir</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {dayKcal > 0 && (
          <div style={{ background: "linear-gradient(135deg,#052e16,#0a1628)", border: "1px solid #166534", borderRadius: 16, padding: 16, marginTop: 10 }}>
            <p style={{ fontSize: 10, color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>Resumen del día</p>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
              {[
                { label: "Total", value: `${dayKcal}`, unit: "kcal", color: "#4ade80" },
                { label: "Restante", value: dayTarget - dayKcal > 0 ? `${dayTarget - dayKcal}` : "✓", unit: dayTarget - dayKcal > 0 ? "kcal" : "objetivo!", color: "#22d3ee" },
                { label: "Progreso", value: `${Math.round((dayKcal / dayTarget) * 100)}%`, unit: "completado", color: "#F59E0B" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>{s.unit}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 6, background: "#1F2937", borderRadius: 3 }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#4ade80,#22d3ee)", borderRadius: 3, width: `${Math.min((dayKcal / dayTarget) * 100, 100)}%`, transition: "width 0.6s" }} />
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", alignItems: "flex-end", backdropFilter: "blur(6px)" }}
          onClick={() => setActiveModal(null)}>
          <div style={{ background: "#0D1117", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", padding: "20px 16px 48px", maxHeight: "88vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: "#374151", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 30 }}>{MEALS_DB[activeModal].emoji}</span>
              <div>
                <h3 style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, color: MEALS_DB[activeModal].color, lineHeight: 1 }}>{MEALS_DB[activeModal].label}</h3>
                <p style={{ fontSize: 11, color: "#6B7280" }}>Objetivo: ~{MEALS_DB[activeModal].target} kcal</p>
              </div>
            </div>
            <div style={{ height: 1, background: "#1F2937", margin: "14px 0" }} />
            {MEALS_DB[activeModal].options.map(opt => {
              const isSelected = plan[`${selectedDay}-${activeModal}`] === opt.id;
              const color = MEALS_DB[activeModal].color;
              return (
                <div key={opt.id} className="opt-card" onClick={() => selectOption(activeModal, opt.id)}
                  style={{ border: `2px solid ${isSelected ? color : "#1F2937"}`, borderRadius: 14, padding: 14, marginBottom: 10, background: isSelected ? color + "12" : "#111" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: isSelected ? color : "#F9FAFB", flex: 1, marginRight: 8 }}>{opt.name}</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: isSelected ? color : "#9CA3AF", whiteSpace: "nowrap" }}>{opt.kcal} kcal</span>
                  </div>
                  {opt.items.map((item, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${color}30` }}>• {item}</p>
                  ))}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {[{ label: "Proteína", v: opt.macros.p, c: "#3B82F6" }, { label: "Carbos", v: opt.macros.c, c: "#F59E0B" }, { label: "Grasas", v: opt.macros.g, c: "#EF4444" }].map(m => (
                      <div key={m.label} style={{ fontSize: 11, color: m.c, background: m.c + "18", padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>{m.label}: {m.v}g</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
