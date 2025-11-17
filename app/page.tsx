"use client";

import { useState } from "react";

export default function Home() {
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
  const [result, setResult] = useState<any>(null);

  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);
    setResult(null);

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

        {/* INPUT FORM */}
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

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Memprediksi..." : "Prediksi Sekarang"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 border border-green-700 bg-green-900/30 rounded-xl">
            <h2 className="font-bold text-lg">Hasil Prediksi:</h2>

            <p className="mt-2">
              Kategori:{" "}
              <strong className="text-green-400">
                {result.prediction}
              </strong>
            </p>

            <div className="mt-3">
              <h3 className="font-medium mb-1">Probabilitas:</h3>
              <ul className="list-disc ml-6 space-y-1">
  {Object.entries(result?.probabilities || {}).map(([label, p]) => (
    <li key={label}>
      {label}: {(Number(p) * 100).toFixed(2)}%
    </li>
  ))}
</ul>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
