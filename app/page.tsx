"use client";

import { useState } from "react";

// Icons as SVG components (replacing lucide-react)
const Smartphone = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Clock = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Zap = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const Moon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Dumbbell = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="5" r="2" strokeWidth="2" />
    <circle cx="19" cy="5" r="2" strokeWidth="2" />
    <circle cx="5" cy="19" r="2" strokeWidth="2" />
    <circle cx="19" cy="19" r="2" strokeWidth="2" />
  </svg>
);

const TrendingUp = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 6 23 6 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type FormDataKey =
  | "Age"
  | "Daily_Usage_Hours"
  | "Phone_Checks_Per_Day"
  | "Time_on_Social_Media"
  | "Time_on_Gaming"
  | "Sleep_Hours"
  | "Exercise_Hours";

interface FormData {
  Age: string;
  Daily_Usage_Hours: string;
  Phone_Checks_Per_Day: string;
  Time_on_Social_Media: string;
  Time_on_Gaming: string;
  Sleep_Hours: string;
  Exercise_Hours: string;
}

export default function PhoneAddictionPredictor() {
  const labels: Record<FormDataKey, string> = {
    Age: "Usia (tahun)",
    Daily_Usage_Hours: "Waktu layar per hari (jam)",
    Phone_Checks_Per_Day: "Berapa kali membuka HP",
    Time_on_Social_Media: "Waktu media sosial (jam)",
    Time_on_Gaming: "Waktu bermain game (jam)",
    Sleep_Hours: "Durasi tidur (jam)",
    Exercise_Hours: "Durasi aktivitas fisik (jam)",
  };

  const icons: Record<FormDataKey, React.ComponentType<{ className?: string }>> = {
    Age: TrendingUp,
    Daily_Usage_Hours: Clock,
    Phone_Checks_Per_Day: Zap,
    Time_on_Social_Media: Smartphone,
    Time_on_Gaming: Smartphone,
    Sleep_Hours: Moon,
    Exercise_Hours: Dumbbell,
  };

  const [formData, setFormData] = useState<FormData>({
    Age: "",
    Daily_Usage_Hours: "",
    Phone_Checks_Per_Day: "",
    Time_on_Social_Media: "",
    Time_on_Gaming: "",
    Sleep_Hours: "",
    Exercise_Hours: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as FormDataKey;
    setFormData({ ...formData, [name]: e.target.value });
  }

  // 🔥 Fungsi saran berdasarkan hasil
  function getAdvice(level: string) {
    if (level === "Rendah") {
      return "Kebiasaan penggunaan HP Anda masih dalam batas wajar. Pertahankan pola penggunaan yang seimbang, tidur cukup, dan tetap lakukan aktivitas fisik.";
    }
    if (level === "Sedang") {
      return "Anda mulai menunjukkan tanda penggunaan HP berlebih. Cobalah mengurangi waktu layar 1–2 jam per hari, gunakan mode fokus, dan atur waktu khusus tanpa HP.";
    }
    if (level === "Tinggi") {
      return "Penggunaan HP Anda sudah berada pada tingkat mengkhawatirkan. Kurangi intensitas secara bertahap, hindari HP sebelum tidur, batasi media sosial, dan bila perlu konsultasikan pada ahli jika sudah mengganggu aktivitas sehari-hari.";
    }
    return "";
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await fetch("https://web-production-57cb3.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan prediksi. Silakan coba lagi.");
    }

    setLoading(false);
  }

  const isFormValid = Object.values(formData).every((val) => val !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4">
            <Smartphone className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Prediksi Kecanduan HP
          </h1>
          <p className="text-slate-400 text-lg">Analisis kebiasaan digital Anda dengan teknologi AI</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {!result ? (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {(Object.keys(formData) as FormDataKey[]).map((key) => {
                const Icon = icons[key];
                return (
                  <div
                    key={key}
                    className="group relative bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-300 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      {labels[key]}
                    </label>

                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      type="number"
                      step="any"
                      placeholder="Masukkan nilai..."
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Menganalisis...
                </span>
              ) : (
                "🔍 Analisis Sekarang"
              )}
            </button>
          </div>
        ) : (
          // Result Card
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl mb-4">
                <Smartphone className="w-10 h-10 text-blue-400" />
              </div>

              <h2 className="text-3xl font-bold">Hasil Analisis</h2>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2">Tingkat Kecanduan</p>
                <p className="text-5xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {result.prediction}
                </p>

              </div>

              {result.probability && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-2">Probabilitas</p>
                  <p className="text-3xl font-bold text-blue-400">{(result.probability * 100).toFixed(1)}%</p>
                </div>
              )}

              {/* 🔥 Saran Berdasarkan Hasil */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mt-4">
                <p className="text-slate-400 text-sm mb-2">Saran</p>
                <p className="text-lg text-slate-300">{getAdvice(result.prediction)}</p>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 border border-slate-700"
              >
                ← Kembali ke Form
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8 text-center text-slate-500 text-sm">
        <p>Powered by AI • Data Anda aman dan tidak disimpan</p>
      </div>
    </div>
  );
}
