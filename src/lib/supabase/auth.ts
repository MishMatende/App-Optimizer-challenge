import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function updateAuth(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  if (request.url == "/" || request.url == "/auth") {
    return NextResponse.next();
  }
  const code = searchParams.get("code");

  const next = searchParams.get("next") ?? "/";

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  const user = (await supabase.auth.getUser())?.data?.user;

  if (user) {
    return NextResponse.next();
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }
  return NextResponse.redirect(`${origin}/auth`);
}
