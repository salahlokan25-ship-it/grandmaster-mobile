import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateFixedId(): string {
  // Generate an 8-digit random number as a string
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return num.toString().padStart(8, '0');
}
