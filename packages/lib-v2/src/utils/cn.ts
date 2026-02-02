import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string | undefined => {
	const result = twMerge(clsx(inputs));
	return result || undefined;
};
