import type { ComponentProps, ElementType } from "react";
import { mergeFinalProps } from "./merge";

type ActiveVariants = Record<string, string | boolean>;
type VariantsConfig = Record<string, Record<string, unknown>>;
type CompoundVariant = Record<string, unknown> & { props: Record<string, unknown> };

/**
 * Checks if all conditions of a compound variant match the active variants.
 */
const matchesCompoundConditions = (
	conditions: Record<string, unknown>,
	activeVariants: ActiveVariants,
): boolean => {
	for (const [key, value] of Object.entries(conditions)) {
		if (activeVariants[key] !== value) {
			return false;
		}
	}
	return true;
};

/**
 * Resolves variant props based on active variant values.
 */
export const resolveVariantProps = <T extends ElementType>(
	variants: VariantsConfig | undefined,
	activeVariants: ActiveVariants,
): Partial<ComponentProps<T>> => {
	if (!variants) {
		return {};
	}

	const allVariantProps: Partial<ComponentProps<T>>[] = [];

	for (const [variantKey, variantValue] of Object.entries(activeVariants)) {
		const variantConfig = variants[variantKey];
		if (!variantConfig) continue;

		// Handle boolean variants
		const lookupKey =
			typeof variantValue === "boolean" ? String(variantValue) : variantValue;
		const propsForVariant = variantConfig[lookupKey];

		if (propsForVariant) {
			allVariantProps.push(propsForVariant as Partial<ComponentProps<T>>);
		}
	}

	return mergeFinalProps(...allVariantProps);
};

/**
 * Resolves compound variant props based on active variant combinations.
 */
export const resolveCompoundVariantProps = <T extends ElementType>(
	compoundVariants: CompoundVariant[] | undefined,
	activeVariants: ActiveVariants,
): Partial<ComponentProps<T>> => {
	if (!compoundVariants || compoundVariants.length === 0) {
		return {};
	}

	const matchingProps: Partial<ComponentProps<T>>[] = [];

	for (const compound of compoundVariants) {
		const { props, ...conditions } = compound;

		if (matchesCompoundConditions(conditions, activeVariants)) {
			matchingProps.push(props as Partial<ComponentProps<T>>);
		}
	}

	return mergeFinalProps(...matchingProps);
};
