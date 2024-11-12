import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenString(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + "…" : str;
}
