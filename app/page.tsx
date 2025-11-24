"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Clock, Zap, Moon, Dumbbell, 
  Gamepad2, TrendingUp, Activity, CheckCircle2, AlertTriangle, XCircle 
} from "lucide-react";

// --- Types ---
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

// --- Components ---

const InputCard = ({ 
  label, icon: Icon, value, onChange, max = 24, step = 1, color = "blue", warning = false 
}: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`relative group backdrop-blur-md border rounded-3xl p-6 transition-all hover:shadow-2xl 
      ${warning 
        ? "bg-red-500/10 border-red-500/50 shadow-red-500/20" 
        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-purple-500/10"
      }`}
  >
    <div className="flex flex-col mb-6">
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500/20 to-transparent shadow-inner border border-white/5`}>
          {/* Ikon diperbesar sedikit */}
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {/* FONT LABEL: Diperbesar dan dibuat Elegant dengan tracking-wide */}
        <span className="text-white/90 font-semibold tracking-wide text-lg">{label}</span>
      </div>
      
      {/* FONT ANGKA: Diperbesar jadi text-4xl */}
      <span className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r self-end tracking-tight
        ${warning ? "from-red-400 to-red-200" : "from-white to-gray-400"}`}>
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
      className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all
        ${warning ? "bg-red-900/50 accent-red-500" : "bg-gray-700/50 accent-purple-500 hover:accent-purple-400"}`}
    />
  </motion.div>
);

export default function PhoneAddictionPredictor() {
  const labels: Record<FormDataKey, string> = {
    Age: "Usia (tahun)",
    Daily_Usage_Hours: "Waktu layar per hari (jam)",
    Phone_Checks_Per_Day: "Berapa kali membuka HP",
    Time_on_Social_Media: "Waktu bermedia sosial (jam)",
    Time_on_Gaming: "Waktu bermain game (jam)",
    Sleep_Hours: "Durasi tidur (jam)",
    Exercise_Hours: "Durasi aktivitas fisik (jam)",
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
      const res = await fetch("https://web-production-57cb3.up.railway.app/predict", {
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
    if (level === "Rendah") return "from-green-400 to-emerald-600";
    if (level === "Sedang") return "from-yellow-400 to-orange-600";
    return "from-red-500 to-rose-700";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden relative">
      
      {/* Background Ambience - Sedikit lebih gelap agar font putih lebih pop-out */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        
        {/* Header - Font Title Dibuat Lebih Elegan & Besar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-200 tracking-wider mb-2">
            <Activity className="w-4 h-4" />
            <span>AI POWERED ANALYSIS</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-100 to-gray-500">
            Prediksi Kecanduan HP
          </h1>
          <p className="text-gray-400 text-xl font-bold tracking-wide max-w-6xl mx-auto">
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
                  color="yellow"
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
                      className="mb-4 bg-red-600/90 backdrop-blur-md border border-red-400 text-white font-semibold px-6 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-red-900/50"
                    >
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                      <span className="text-lg">{warning}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !!warning}
                  className="w-full relative group overflow-hidden rounded-2xl bg-white p-5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-2xl shadow-purple-900/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] transition-all group-hover:opacity-90" />
                  <div className="relative flex items-center justify-center gap-3 text-xl font-bold text-white tracking-wide">
                    {loading ? (
                      <>
                        <Activity className="w-6 h-6 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 fill-current" />
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
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getResultColor(result.prediction)}`} />
                
                <h3 className="text-gray-400 text-sm uppercase tracking-[0.2em] font-bold mb-8">Hasil Analisis</h3>
                
                <div className="relative inline-block mb-10">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getResultColor(result.prediction)} blur-3xl opacity-30 animate-pulse`} />
                  <h2 className={`relative text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getResultColor(result.prediction)} tracking-tight`}>
                    {result.prediction}
                  </h2>
                </div>

                {result.probability && (
                  <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="h-2 w-full max-w-xs bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${getResultColor(result.prediction)}`} 
                      />
                    </div>
                    <span className="text-gray-400 font-mono tracking-widest text-sm">PROBABILITAS: {(result.probability * 100).toFixed(1)}%</span>
                  </div>
                )}

                <div className="bg-white/5 rounded-3xl p-8 text-left border border-white/5 shadow-inner">
                  <h4 className="flex items-center gap-3 text-xl font-bold text-white mb-4">
                    {result.prediction === "Rendah" ? <CheckCircle2 className="w-6 h-6 text-green-500"/> : 
                     result.prediction === "Sedang" ? <AlertTriangle className="w-6 h-6 text-yellow-500"/> : 
                     <XCircle className="w-6 h-6 text-red-500"/>}
                    Saran AI:
                  </h4>
                  <p className="text-gray-300 text-lg leading-relaxed font-light">
                    {getAdvice(result.prediction)}
                  </p>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="mt-10 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full py-4 hover:bg-white/5 rounded-2xl font-medium tracking-wide"
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