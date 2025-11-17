import React from "react";


export default function InputField({ label, name, value, onChange }: any) {
return (
<div>
<label className="block text-sm font-medium mb-1">{label}</label>
<input
name={name}
value={value}
onChange={onChange}
className="w-full border rounded px-3 py-2"
/>
</div>
);
}