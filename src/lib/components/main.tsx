import { SupabaseClient, User } from "@supabase/supabase-js"
import NavBar from "./nav"
import React, { useEffect, useState } from "react"
import { toggleAside } from "../hooks/toggle-aside";
import { z } from "zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ModeToggle } from "./dark_mode";

import routes from "~/server/routes.json"

interface MainBodyProps {
    user: User | null | undefined,
    children: React.ReactNode
    title: string;
}


interface AsideProplet {
    label: string
    link: string
}

export default function MainBody({ user, children, title }: MainBodyProps) {

    const supabaseClient = useSupabaseClient()
    const toggle_aside = toggleAside()
    if (z.object({
        user_metadata: z.any()
    }).safeParse(user).success) {


        return (<main className="screen-width min-h-screen">
            <title>{title}</title>
            <NavBar {...{ user, toggle_aside }} />
            <div className=" h-full min-h-screen relative w-full overflow-hidden" >
                <section className="w-full h-full">
                    {children}
                </section>

                <aside className={`${!toggle_aside.show ? "hidden" : "visible"} absolute h-full bg-gray-900 text-white top-0 right-0 min-w-40`}>
                    <ul>
                        <li className="w-full hover:text-[lightblue] mb-1 flex items-center justify-center" >
                            <div className="flex"><ModeToggle /></div>
                        </li>
                        {[
                            { label: "Profile", link: '#' },
                            { label: "Posts", link: '#' },
                            { label: "Interactions", link: '#' },
                            { label: "Billing", link: '#' },
                            { label: "Settings", link: '#' },
                        ].map((v: AsideProplet, i: number) => (
                        <li className="w-full hover:text-[lightblue] mb-1" key={`lin_${i}`}>
                            <a href={v.link} className=" flex"><p className="flex m-auto">{v.label}</p></a>
                        </li>
                        ))}
                        <li className="w-full hover:text-[lightblue] mb-1" >
                            <button type="button" className="w-full flex" onClick={() => supabaseClient.auth.signOut({ scope: 'local' }).then((e) => {
                                if (e.error) {
                                    console.log(e)
                                }
                                location.reload()
                            })}>
                                <p className="flex m-auto">Sign Out</p>
                            </button>
                        </li>
                    </ul>

                </aside>
            </div>

        </main>)
    }



    return (<main className="screen-width min-h-screen">
        <title>{title}</title>
        <NavBar {...{ user, toggle_aside }} />
        <div className=" h-full min-h-screen relative w-full overflow-hidden" >
            <section className="w-full h-full">
                {children}
            </section>

        </div>

    </main>)
}




export function Container({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex h-full w-full">
            <div className="flex mx-auto w-[480px] md:w-[680px] flex-col h-full">
                {children}
            </div>
        </div>
    )
}
