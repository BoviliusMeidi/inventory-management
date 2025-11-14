interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  titleColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  titleColor = "text-gray-700",
}: StatCardProps) {
  return (
    <div className="text-xs sm:text-base flex flex-col gap-1">
      <h3 className={`font-semibold ${titleColor}`}>{title}</h3>
      <p className="font-semibold">{value}</p>
      <p className="font-medium opacity-65">{description}</p>
    </div>
  );
}