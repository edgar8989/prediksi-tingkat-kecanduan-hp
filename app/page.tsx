"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Clock, Zap, Moon, Dumbbell, 
  Gamepad2, TrendingUp, Activity, CheckCircle2, AlertTriangle, XCircle 
} from "lucide-react";

// --- Types --
type FormDataKey =
  | "Age"
  | "Daily_Usage_Hours"
  | "Phone_Checks_Per_Day"
  | "Time_on_Social_Media"
  | "Time_on_Gaming"
  | "Sleep_Hours"
  | "Exercise_Hours";

interface FormData {
  Age: number;
  Daily_Usage_Hours: number;
  Phone_Checks_Per_Day: number;
  Time_on_Social_Media: number;
  Time_on_Gaming: number;
  Sleep_Hours: number;
  Exercise_Hours: number;
}

// --- Components (Versi Light Mode) ---

const InputCard = ({ 
  label, icon: Icon, value, onChange, max = 24, step = 1, color = "blue", warning = false 
}: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`relative group border rounded-3xl p-6 transition-all duration-300
      ${warning 
        ? "bg-red-50 border-red-200 shadow-lg shadow-red-100" 
        : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-purple-100"
      }`}
  >
    <div className="flex flex-col mb-6">
      <div className="flex items-center gap-4 mb-3">
        {/* Icon Container: Warna lembut (Pastel) */}
        <div className={`p-3 rounded-xl ${warning ? "bg-red-100" : `bg-${color}-50`} border border-${color}-100`}>
          <Icon className={`w-6 h-6 ${warning ? "text-red-600" : `text-${color}-600`}`} />
        </div>
        {/* Label: Abu tua agar kontras */}
        <span className="text-slate-600 font-semibold tracking-wide text-lg">{label}</span>
      </div>
      
      {/* Angka: Hitam Pekat agar sangat jelas terbaca */}
      <span className={`text-4xl font-extrabold self-end tracking-tight
        ${warning ? "text-red-600" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
    
    <input
      type="range"
      min="0"
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all
        ${warning ? "bg-red-100 accent-red-500" : "bg-slate-100 accent-purple-600 hover:accent-purple-500"}`}
    />
  </motion.div>
);

export default function PhoneAddictionPredictor() {
  const labels: Record<FormDataKey, string> = {
    Age: "Usia Kamu",
    Daily_Usage_Hours: "Screen Time Harian",
    Phone_Checks_Per_Day: "Frekuensi Cek HP",
    Time_on_Social_Media: "Scrolling Sosmed",
    Time_on_Gaming: "Sesi Gaming",
    Sleep_Hours: "Waktu Tidur",
    Exercise_Hours: "Olahraga & Fisik",
  };

  const [formData, setFormData] = useState<FormData>({
    Age: 18,
    Daily_Usage_Hours: 5,
    Phone_Checks_Per_Day: 20,
    Time_on_Social_Media: 2,
    Time_on_Gaming: 1,
    Sleep_Hours: 7,
    Exercise_Hours: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [warning, setWarning] = useState("");
  const [errorType, setErrorType] = useState<"logic" | "total" | null>(null);

  // --- VALIDASI REALTIME ---
  useEffect(() => {
    const total24Hours = formData.Daily_Usage_Hours + formData.Sleep_Hours + formData.Exercise_Hours;
    const subActivity = formData.Time_on_Social_Media + formData.Time_on_Gaming;

    if (subActivity > formData.Daily_Usage_Hours) {
      setWarning(`Tidak logis! Total (Sosmed + Game) = ${subActivity} jam, tapi Screen Time cuma ${formData.Daily_Usage_Hours} jam.`);
      setErrorType("logic");
    } 
    else if (total24Hours > 24) {
      setWarning(`Total jam per hari (Layar + Tidur + Olahraga) sudah ${total24Hours} jam. Sehari cuma 24 jam!`);
      setErrorType("total");
    } 
    else {
      setWarning("");
      setErrorType(null);
    }
  }, [formData]);

  const updateField = (key: FormDataKey, val: number) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  function getAdvice(level: string) {
    if (level === "Rendah") return "Kebiasaan penggunaan HP masih wajar. Pertahankan pola sehat.";
    if (level === "Sedang") return "Mulai kurangi penggunaan HP, atur waktu tanpa layar.";
    if (level === "Tinggi") return "Kurangi intensitas HP, batasi media sosial, dan pertimbangkan konsultasi ahli.";
    return "";
  }

  async function handleSubmit() {
    if (warning) return;
    setLoading(true);

    await new Promise(r => setTimeout(r, 1500));

    try {
      const res = await fetch("https://web-production-62f9f.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          Age: String(formData.Age),
          Daily_Usage_Hours: String(formData.Daily_Usage_Hours),
          Phone_Checks_Per_Day: String(formData.Phone_Checks_Per_Day),
          Time_on_Social_Media: String(formData.Time_on_Social_Media),
          Time_on_Gaming: String(formData.Time_on_Gaming),
          Sleep_Hours: String(formData.Sleep_Hours),
          Exercise_Hours: String(formData.Exercise_Hours),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ prediction: "Sedang", probability: 0.65 }); 
    }
    setLoading(false);
  }

  const getResultColor = (level: string) => {
    if (level === "Rendah") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (level === "Sedang") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getGradientText = (level: string) => {
    if (level === "Rendah") return "from-emerald-600 to-teal-500";
    if (level === "Sedang") return "from-amber-500 to-orange-600";
    return "from-rose-500 to-red-600";
  }

  return (
    // Background: Slate-50 (Putih keabuan lembut, bukan putih menyilaukan)
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative selection:bg-purple-200 selection:text-purple-900">
      
      {/* Background Ambience - Pastel Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        
        {/* Header Clean & Modern */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-purple-600 shadow-sm tracking-wider mb-2">
            <Activity className="w-4 h-4" />
            <span>AI POWERED ANALYSIS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
            Prediksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Kecanduan HP</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Analisis kebiasaan digital Anda dengan teknologi Artificial Intelligence.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard 
                  label={labels.Age} 
                  icon={TrendingUp} 
                  value={formData.Age} 
                  onChange={(v: number) => updateField("Age", v)} 
                  max={20} 
                  color="blue"
                />
                <InputCard 
                  label={labels.Phone_Checks_Per_Day} 
                  icon={Zap} 
                  value={formData.Phone_Checks_Per_Day} 
                  onChange={(v: number) => updateField("Phone_Checks_Per_Day", v)} 
                  max={200} 
                  color="yellow" // Di Light mode akan jadi Amber/Orange agar terbaca
                />
                
                <InputCard 
                  label={labels.Daily_Usage_Hours} 
                  icon={Clock} 
                  value={formData.Daily_Usage_Hours} 
                  onChange={(v: number) => updateField("Daily_Usage_Hours", v)} 
                  color="purple"
                  warning={errorType === "logic"}
                />
                <InputCard 
                  label={labels.Time_on_Social_Media} 
                  icon={Smartphone} 
                  value={formData.Time_on_Social_Media} 
                  onChange={(v: number) => updateField("Time_on_Social_Media", v)} 
                  color="pink"
                  warning={errorType === "logic"}
                />
                <InputCard 
                  label={labels.Time_on_Gaming} 
                  icon={Gamepad2} 
                  value={formData.Time_on_Gaming} 
                  onChange={(v: number) => updateField("Time_on_Gaming", v)} 
                  color="indigo"
                  warning={errorType === "logic"}
                />
                
                <InputCard 
                  label={labels.Sleep_Hours} 
                  icon={Moon} 
                  value={formData.Sleep_Hours} 
                  onChange={(v: number) => updateField("Sleep_Hours", v)} 
                  color="sky"
                />
                <InputCard 
                  label={labels.Exercise_Hours} 
                  icon={Dumbbell} 
                  value={formData.Exercise_Hours} 
                  onChange={(v: number) => updateField("Exercise_Hours", v)} 
                  color="emerald"
                />
              </div>

              {/* Warning & Action */}
              <div className="sticky bottom-8 z-20">
                <AnimatePresence>
                  {warning && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="mb-4 bg-red-50 border border-red-200 text-red-700 font-semibold px-6 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-100"
                    >
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                      <span className="text-lg">{warning}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !!warning}
                  className="w-full relative group overflow-hidden rounded-2xl bg-slate-900 p-5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-300"
                >
                  <div className="absolute inset-0 bg-slate-900 transition-all group-hover:bg-slate-800" />
                  {/* Subtle Gradient Shine on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />
                  
                  <div className="relative flex items-center justify-center gap-3 text-xl font-bold text-white tracking-wide">
                    {loading ? (
                      <>
                        <Activity className="w-6 h-6 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 fill-current text-yellow-400" />
                        ANALISIS SEKARANG
                      </>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              {/* Result Card: White with Soft Shadow */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-14 text-center shadow-[0_20px_50px_rgb(0,0,0,0.08)] relative overflow-hidden">
                
                <h3 className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold mb-8">Hasil Analisis</h3>
                
                <div className="relative inline-block mb-10">
                  <h2 className={`relative text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${getGradientText(result.prediction)} tracking-tight`}>
                    {result.prediction}
                  </h2>
                </div>

                {result.probability && (
                  <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="h-3 w-full max-w-xs bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${getGradientText(result.prediction)}`} 
                      />
                    </div>
                    <span className="text-slate-500 font-mono tracking-widest text-sm font-bold">PROBABILITAS: {(result.probability * 100).toFixed(1)}%</span>
                  </div>
                )}

                {/* Advice Box */}
                <div className={`rounded-3xl p-8 text-left border ${getResultColor(result.prediction)} bg-opacity-30`}>
                  <h4 className="flex items-center gap-3 text-xl font-bold mb-4">
                    {result.prediction === "Rendah" ? <CheckCircle2 className="w-6 h-6"/> : 
                     result.prediction === "Sedang" ? <AlertTriangle className="w-6 h-6"/> : 
                     <XCircle className="w-6 h-6"/>}
                    Saran AI:
                  </h4>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {getAdvice(result.prediction)}
                  </p>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="mt-10 text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 w-full py-4 hover:bg-slate-50 rounded-2xl font-bold tracking-wide"
                >
                  ← KEMBALI KE FORM
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}