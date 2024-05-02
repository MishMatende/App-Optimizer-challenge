import React from "react"
import { create } from 'zustand'

const useStore = create<{
    show:boolean,
    toggle:()=>void,
    off:()=>void
}>((set) => ({
  show: false,
  toggle: () => set((state) => ({ show: !state.show })),
  off: () => set({ show: false }),
}))

export function toggleAside(){
    const aside_ = useStore()
    return aside_
}

export type ToggleAsideT = ReturnType<typeof toggleAside>