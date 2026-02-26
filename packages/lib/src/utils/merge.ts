import type { CSSProperties } from "react";
import { cn } from "./cn";

type StyleObject = CSSProperties | Record<string, unknown>;
type StyleValue = StyleObject | number;
type StyleInput = StyleValue | StyleInput[] | null | false | undefined;

const isFunction = (value: unknown): value is Function =>
	typeof value === "function";

const isObjectLike = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const hasOnlyEnumerableStringDataKeys = (value: object): boolean => {
	try {
		if (Object.getOwnPropertySymbols(value).length > 0) {
			return false;
		}

		const descriptors = Object.getOwnPropertyDescriptors(value);
		const ownEnumerableKeys = Object.keys(value);
		const descriptorKeys = Object.keys(descriptors);

		if (descriptorKeys.length !== ownEnumerableKeys.length) {
			return false;
		}

		for (const key of descriptorKeys) {
			const descriptor = descriptors[key];
			if (!descriptor || !descriptor.enumerable) {
				return false;
			}

			// Accessor props (get/set) can trigger runtime errors when merged.
			if ("get" in descriptor || "set" in descriptor) {
				return false;
			}
		}

		return true;
	} catch {
		return false;
	}
};

const hasRequiresAnimatedComponentMarker = (value: object): boolean => {
	try {
		return "_requiresAnimatedComponent" in value;
	} catch {
		return true;
	}
};

const isPlainObject = (value: unknown): value is StyleObject => {
	if (!isObjectLike(value)) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
};

const isMergeableStyleObject = (value: unknown): value is StyleObject =>
	isPlainObject(value) &&
	!hasRequiresAnimatedComponentMarker(value) &&
	hasOnlyEnumerableStringDataKeys(value);

const flattenStyleInput = (style: StyleInput, result: StyleValue[]): void => {
	if (style === undefined || style === null || style === false) {
		return;
	}

	if (Array.isArray(style)) {
		for (const nestedStyle of style) {
			flattenStyleInput(nestedStyle, result);
		}
		return;
	}

	result.push(style);
};

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
	...styles: StyleInput[]
): StyleValue | StyleValue[] | undefined => {
	const flattenedStyles: StyleValue[] = [];
	for (const style of styles) {
		flattenStyleInput(style, flattenedStyles);
	}

	if (flattenedStyles.length === 0) {
		return undefined;
	}

	if (flattenedStyles.length === 1) {
		return flattenedStyles[0];
	}

	const shouldMergeAsObject = flattenedStyles.every(isMergeableStyleObject);

	if (shouldMergeAsObject) {
		try {
			const merged = Object.assign({}, ...flattenedStyles);
			return Object.keys(merged).length > 0 ? merged : undefined;
		} catch {
			// Defensive fallback for proxy/accessor-based styles (e.g. Reanimated).
			return flattenedStyles;
		}
	}

	// Preserve reference identity for animated/non-plain styles (e.g. Reanimated).
	return flattenedStyles;
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
	const allStyles: StyleInput[] = [];
	const allClassNames: (string | undefined)[] = [];
	const functionsToCompose: Record<string, Function[]> = {};

	for (const source of propSources) {
		if (!source) continue;

		for (const [key, value] of Object.entries(source)) {
			if (value === undefined) continue;

			if (key === "style" && value) {
				allStyles.push(value as StyleInput);
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
	if (mergedStyle !== undefined) {
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
