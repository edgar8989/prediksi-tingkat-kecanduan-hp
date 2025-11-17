import { NextResponse } from "next/server";


export async function POST(request: Request) {
try {
const body = await request.json();


const res = await fetch("https://web-production-57cb3.up.railway.app/predict", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(body),
});


const data = await res.json();
return NextResponse.json(data, { status: res.status });
} catch (err: any) {
return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
}
}