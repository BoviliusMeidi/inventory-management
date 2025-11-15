import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value?: ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-row justify-between items-center tracking-wide font-semibold">
      <h3 className="text-gray-500">{label}</h3>
      <div className="text-gray-800 text-right">{value ?? "N/A"}</div>
    </div>
  );
}