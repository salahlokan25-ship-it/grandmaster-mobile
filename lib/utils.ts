import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateStrategoId(): string {
  // Generate a 10-digit random number as a string (Free Fire style)
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  return num.toString();
}
