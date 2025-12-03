import Image from "next/image";

interface DashboardStatProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function DashboardStat({ title, value, icon, color = "text-gray-600" }: DashboardStatProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full py-2">
      <div className="p-2 bg-gray-50 rounded-full">
         <Image src={icon} width={32} height={32} alt={title} />
      </div>
      <div className="flex flex-col items-center">
        <p className={`font-bold text-lg ${color}`}>{value}</p>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      </div>
    </div>
  );
}