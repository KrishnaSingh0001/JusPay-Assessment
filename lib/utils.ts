// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Sprite } from "@/types/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkCollision(sprite1: Sprite, sprite2: Sprite): boolean {
  const dx = sprite1.x - sprite2.x
  const dy = sprite1.y - sprite2.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  return distance < sprite1.width / 2 + sprite2.width / 2
}