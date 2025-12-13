"use server";

import { createClientServer } from "@/lib/supabase/server";
import { ReportData } from "@/lib/types";

export async function getReportData(
  startDate: string,
  endDate: string
): Promise<ReportData | null> {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const formattedEndDate = new Date(endDate);
  formattedEndDate.setHours(23, 59, 59, 999);

  const { data, error } = await supabase.rpc("get_financial_report_data", {
    p_user_id: user.id,
    p_start_date: startDate,
    p_end_date: formattedEndDate.toISOString(),
  });

  if (error) {
    console.error("Error fetching report data (RPC):", error.message);
    return null;
  }

  return data as ReportData;
}
