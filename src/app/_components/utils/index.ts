import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(str?: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
