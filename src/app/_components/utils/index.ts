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

export const run = <TResult>(fn: () => TResult): TResult => fn();

export const listWithAnd = (list: string[]) => {
  if (list.length === 0) {
    return "";
  }
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }
  return `${list.slice(0, -1).join(", ")}, and ${list.at(-1)}`;
};

export const pluralize = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;
