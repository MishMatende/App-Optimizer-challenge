import Dashboard from "comps/Dashboard";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { supabaseBrowser } from "~/lib/supabase/browser";

export default function DashboardPage() {
  const supabase = supabaseBrowser()
  
  return <Dashboard />;
}
