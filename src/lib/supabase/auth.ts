import { NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { env } from "~/env";

export async function updateAuth(request: NextRequest) {
    const { searchParams, origin, pathname } = new URL(request.url);

    for (const p of ["_next", "assets", "favicon", "public", "api"]) {
        if (pathname.includes(p)) {
            return NextResponse.next();
        }
    }

    const code = searchParams.get("code");
    const response = NextResponse.next();

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return response.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.delete({ name, ...options });
                },
            },
        },
    );

    const user = (await supabase.auth.getUser())?.data?.user;
    if (user && !code?.length) {
        return NextResponse.next();
    }

    console.log(`pathname:\t${pathname}\norigin:\t${origin}\ncode:\t${code ?? ""}`);

    switch (pathname) {
        case "/":
        case "/auth":
        case "/auth/confirm":
            return NextResponse.next();

        case "/dashboard": {
            // // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            if (!code?.length) break;
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
                return NextResponse.redirect(`${origin}/dashboard`);
            }
        }
        break;
        default:
            if (!code?.length) {
                return NextResponse.redirect(new URL("/auth", request.url));
            }

            return NextResponse.redirect(`${origin}/auth`);
    }
}
