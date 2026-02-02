import type { CSSProperties } from "react";
import { cn } from "./cn";

type StyleObject = CSSProperties | Record<string, unknown>;

const isFunction = (value: unknown): value is Function =>
	typeof value === "function";

/**
 * Composes multiple functions into one that calls them in sequence.
 * Returns the result of the last function.
 */
const composeFunctions = (...functions: unknown[]): Function => {
	const validFunctions = functions.filter(isFunction);

	if (validFunctions.length === 0) {
		return () => undefined;
	}

	if (validFunctions.length === 1) {
		return validFunctions[0]!;
	}

	return (...args: unknown[]) => {
		let result: unknown;
		for (const fn of validFunctions) {
			result = fn(...args);
		}
		return result;
	};
};

/**
 * Merges multiple style objects into one.
 * Returns undefined if the result is empty.
 */
export const mergeStyles = (
	...styles: (StyleObject | undefined)[]
): StyleObject | undefined => {
	const validStyles = styles.filter(Boolean) as StyleObject[];

	if (validStyles.length === 0) {
		return undefined;
	}

	const merged = Object.assign({}, ...validStyles);
	return Object.keys(merged).length > 0 ? merged : undefined;
};

/**
 * Merges final props from multiple sources.
 * Handles className merging with cn(), style merging, and function composition.
 * Order: base -> variants -> compoundVariants -> direct (last wins for non-composable)
 */
export const mergeFinalProps = <P extends Record<string, unknown>>(
	...propSources: (Partial<P> | undefined)[]
): P => {
	const finalProps: Record<string, unknown> = {};
	const allStyles: StyleObject[] = [];
	const allClassNames: (string | undefined)[] = [];
	const functionsToCompose: Record<string, Function[]> = {};

	for (const source of propSources) {
		if (!source) continue;

		for (const [key, value] of Object.entries(source)) {
			if (value === undefined) continue;

			if (key === "style" && value) {
				allStyles.push(value as StyleObject);
			} else if (key === "className" && typeof value === "string") {
				allClassNames.push(value);
			} else if (isFunction(value)) {
				if (!functionsToCompose[key]) {
					functionsToCompose[key] = [];
				}
				functionsToCompose[key].push(value);
			} else {
				finalProps[key] = value;
			}
		}
	}

	// Merge styles
	const mergedStyle = mergeStyles(...allStyles);
	if (mergedStyle) {
		finalProps.style = mergedStyle;
	}

	// Merge classNames
	const mergedClassName = cn(...allClassNames);
	if (mergedClassName) {
		finalProps.className = mergedClassName;
	}

	// Compose functions
	for (const [key, functions] of Object.entries(functionsToCompose)) {
		finalProps[key] = composeFunctions(...functions);
	}

	return finalProps as P;
};
