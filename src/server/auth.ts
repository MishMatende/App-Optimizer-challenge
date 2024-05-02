import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse, type GetServerSidePropsContext } from "next";


// For more information on each option (and a full list of options) go to
// // https://authjs.dev/reference/core#authconfig
// export default NextAuth({
//   // https://authjs.dev/reference/core/providers
//   providers: [...],
//   adapter: SupabaseAdapter({
//     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
//   }),
//   // ...
// })

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (
    ctx: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
) => {
    // Create authenticated Supabase Client

    const supabase = createPagesServerClient(ctx);
    const sess = supabase.auth.getSession();
    const user_ = supabase.auth.getUser();

    // Check if we have a session
    const {
        data: { session },
    } = await sess;

	if (!session) {
        return null;
    }
    const { data: user } = await user_;

    if (!user.user) {
        return null;
    }

    
    return { ...session, user: user.user };
};
