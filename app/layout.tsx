import "./globals.css";
import React from "react";


export const metadata = {
title: "Phone Addiction Predictor",
description: "Frontend for Phone Addiction ML API",
};


export default function RootLayout({ children, }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div className="min-h-screen bg-gray-100">{children}</div>
</body>
</html>
);
}