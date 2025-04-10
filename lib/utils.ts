import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import L from "leaflet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
