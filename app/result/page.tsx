"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const sp = useSearchParams();
  const pred = sp.get("pred");

  const labels = ["Rendah", "Sedang", "Tinggi"];
  const probs = labels.map((l) => ({ label: l, value: Number(sp.get(l) || 0) }));

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8 backdrop-blur">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 Hasil Prediksi</h1>

        <p className="mb-2 text-lg">
          Kategori:{" "}
          <strong className="text-blue-400">
            {pred || "-"}
          </strong>
        </p>

        <div className="mt-4">
          <h3 className="font-medium text-neutral-300">Probabilitas</h3>
          <ul className="list-disc ml-6 mt-3 space-y-1">
            {probs.map((p) => (
              <li key={p.label}>
                {p.label}: {(p.value * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
