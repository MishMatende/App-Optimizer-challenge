import { NextRequest, NextResponse } from "next/server";
import { updateAuth } from "./lib/supabase/auth";

export default async function middleware(request: NextRequest) {
  // return NextResponse.next()
  return await updateAuth(request);
}
