interface StatCardDoubleProps {
  title: string;
  valueA: string | number;
  descriptionA: string;
  valueB: string | number;
  descriptionB: string;
  titleColor?: string;
}

export default function StatCardDouble({
  title,
  valueA,
  descriptionA,
  valueB,
  descriptionB,
  titleColor = "text-gray-700",
}: StatCardDoubleProps) {
  return (
    <div className="text-xs sm:text-base flex flex-col gap-1">
      <h3 className={`font-semibold text-center ${titleColor}`}>{title}</h3>
      <div className="flex flex-row justify-between font-semibold">
        <p>{valueA}</p>
        <p>{valueB}</p>
      </div>
      <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
        <p>{descriptionA}</p>
        <p>{descriptionB}</p>
      </div>
    </div>
  );
}