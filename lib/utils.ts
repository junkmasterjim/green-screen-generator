import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function highestPercentage(input: string): number {
	const percentages = input.match(/\d+(?=%)/g);
	if (!percentages) return 0;

	const numericPercentages = percentages
		.map(Number)
		.filter((percentage) => percentage !== 100); // Omit 100

	return numericPercentages.length > 0 ? Math.max(...numericPercentages) : 0;
}
