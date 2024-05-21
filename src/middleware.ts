import { NextRequest } from "next/server";
import { updateAuth } from "./lib/supabase/auth";

export default async function middleware(request: NextRequest) {
  return await updateAuth(request);
}
