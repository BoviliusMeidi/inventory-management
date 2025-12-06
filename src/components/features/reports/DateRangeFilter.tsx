"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .split("T")[0];
  const defaultEnd = new Date().toISOString().split("T")[0];

  const [start, setStart] = useState(searchParams.get("start") || defaultStart);
  const [end, setEnd] = useState(searchParams.get("end") || defaultEnd);

  const handleApply = () => {
    router.push(`?start=${start}&end=${end}`);
  };

  return (
    <div className="flex items-end gap-4 bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">From</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border rounded-md p-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">To</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border rounded-md p-2 text-sm"
        />
      </div>
      <Button onClick={handleApply} className="h-10">
        Apply Filter
      </Button>
    </div>
  );
}
