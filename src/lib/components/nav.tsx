import { User } from "@supabase/supabase-js";
import { FaBars, FaHamburger, FaWindowClose, FaXing } from "react-icons/fa";

import { ToggleAsideT } from "../hooks/toggle-aside";
import Image from "next/image";
import { ModeToggle } from "./dark_mode";
import routes from "~/server/routes.json"

interface NavBarProps {
  user: User | null | undefined,
  toggle_aside: ToggleAsideT
}

export default function NavBar({ user, toggle_aside: tog }: NavBarProps) {

  if (user) {
    const imgsrc = user?.user_metadata?.avatar_url ?? ''

    return (<>
      <header className="relative w-full overflow-hidden  min-h-[3rem]">
        <nav className="fixed w-full min-h-[3rem] flex pl-2  border-b-2 border-b-gray-100 opacity-100"      >
          <a href={routes.index} className="px-2 items-center justify-center flex hover:bg-blue-100">
            <Image src={'/images/sunflower_logo.png'} alt="logo" className="w-[32px]" width={32} height={32} />
            <h1 className="px-2 items-center justify-center flex ">
              Admin App
            </h1>
          </a>

          <div className="flex   ml-auto" >
            {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
            <a className="h-full flex items-center justify-center pr-2" href='#'>
              <Image src={imgsrc} alt="user profile pix" width={32} height={32}
              />
            </a>
            <div className="px-2 flex items-center justify-center  hover:bg-[lightblue]" onClick={tog.toggle}>
              {
                tog.show ?
                  <FaWindowClose /> :
                  <FaBars />
              }
            </div>

          </div>

        </nav>

      </header>
    </>)
  }

  return (<>
    <header className="relative w-full overflow-hidden  min-h-[3rem]">
      <nav className="fixed w-full min-h-[3rem] flex pl-2  border-b-2 border-b-gray-100 opacity-100"      >
        <a href={routes.index} className="px-2 items-center justify-center flex hover:bg-blue-100">
          <Image src={'/images/sunflower_logo.png'} alt="logo" className="w-[32px]" width={32} height={32} />
          <h1 className="px-2 items-center justify-center flex ">
            Admin App
          </h1>
        </a>

        <div className="ml-auto px-2 items-center justify-center flex"><ModeToggle /></div>
        <div className="flex flex-row-reverse px-2">
          {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
          <a href={"#"} className="button">
            Sign In
          </a>
        </div>
      </nav>

    </header>
  </>)
}


