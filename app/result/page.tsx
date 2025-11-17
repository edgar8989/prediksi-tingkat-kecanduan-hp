"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("predictionData");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const pred = data?.prediction || "-";
  const probs = data?.probabilities || {};

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8 backdrop-blur">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 Hasil Prediksi</h1>

        <p className="mb-2 text-lg">
          Kategori: <strong className="text-blue-400">{pred}</strong>
        </p>

        <div className="mt-4">
          <h3 className="font-medium text-neutral-300">Probabilitas</h3>
          <ul className="list-disc ml-6 mt-3 space-y-1">
            {Object.entries(probs).map(([label, p]) => (
              <li key={label}>
                {label}: {(Number(p) * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
