"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const labels: any = {
    Age: "Usia (tahun)",
    Daily_Usage_Hours: "Waktu layar per hari (jam)",
    Phone_Checks_Per_Day: "Berapa kali membuka HP",
    Time_on_Social_Media: "Waktu media sosial (jam)",
    Time_on_Gaming: "Waktu bermain game (jam)",
    Sleep_Hours: "Durasi tidur (jam)",
    Exercise_Hours: "Durasi aktivitas fisik (jam)",
  };

  const [formData, setFormData] = useState({
    Age: "",
    Daily_Usage_Hours: "",
    Phone_Checks_Per_Day: "",
    Time_on_Social_Media: "",
    Time_on_Gaming: "",
    Sleep_Hours: "",
    Exercise_Hours: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await fetch(
        "https://web-production-57cb3.up.railway.app/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      // Simpan hasil prediksi di localStorage
      localStorage.setItem("predictionData", JSON.stringify(data));

      // Redirect ke halaman result
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan prediksi");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8 backdrop-blur">
        <h1 className="text-3xl font-bold mb-6 text-center">
          📱 Prediksi Kecanduan HP
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm mb-1 text-neutral-300">
                {labels[key]}
              </label>

              <input
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                type="number"
                step="any"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Memprediksi..." : "Prediksi Sekarang"}
        </button>
      </div>
    </main>
  );
}
