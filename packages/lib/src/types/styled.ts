import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type {
	InferContextValue,
	StyledContext,
	StyledContextInput,
} from "./createStyledContext";
import type { VariantProps } from "./shared";

// ============================================================================
// Types for styled() WITH context
// ============================================================================

/**
 * Builds the variants config type based on the original input arrays
 * For ["boolean"]: { true?: ..., false?: ... }
 * For string arrays: { [value]?: ... }
 */
export type VariantsConfigFromInput<
	T extends ElementType,
	Input extends StyledContextInput,
> = {
	[K in keyof Input]?: Input[K] extends readonly ["boolean"]
		? { true?: VariantProps<T>; false?: VariantProps<T> }
		: { [V in Input[K][number]]?: VariantProps<T> };
};

/**
 * Validates variants config:
 * - Keys in context: MUST use only values defined in context
 * - Keys NOT in context: local variant, any values allowed with proper props type
 * Intersection with VariantsConfigFromInput provides autocomplete for context keys
 */
export type ValidatedVariantsConfig<
	T extends ElementType,
	Input extends StyledContextInput,
	V,
> = {
	[K in keyof V]: K extends keyof Input
		? // Key exists in context - MUST use only context values
			Input[K] extends readonly ["boolean"]
			? { true?: VariantProps<T>; false?: VariantProps<T> }
			: { [Val in Input[K][number]]?: VariantProps<T> }
		: // Key NOT in context - local variant, infer values with proper props type
			{ [Val in keyof V[K]]?: VariantProps<T> };
} & VariantsConfigFromInput<T, Input>;

/**
 * Validates defaultVariants:
 * - Keys in context: use context value types
 * - Keys NOT in context: infer from variants passed
 */
export type ValidatedDefaultVariants<
	Input extends StyledContextInput,
	V,
> = DefaultVariantsFromInput<Input> & {
	[K in keyof V as K extends keyof Input ? never : K]?: V[K] extends Record<
		infer Keys,
		unknown
	>
		? "true" extends Keys
			? boolean
			: "false" extends Keys
				? boolean
				: Keys
		: never;
};

/**
 * Default variants type based on the original input arrays
 * For ["boolean"]: boolean
 * For string arrays: union of values
 */
export type DefaultVariantsFromInput<Input extends StyledContextInput> = {
	[K in keyof Input]?: Input[K] extends readonly ["boolean"]
		? boolean
		: Input[K][number];
};

/**
 * Infers variant props from local variants for component props
 */
export type InferLocalVariantProps<V> = {
	[K in keyof V as K extends "children" ? never : K]?: V[K] extends Record<
		infer Keys,
		unknown
	>
		? "true" extends Keys
			? boolean
			: "false" extends Keys
				? boolean
				: Keys
		: never;
};

/**
 * Props for styled component with context
 * Explicitly includes children to ensure it's always available
 * LocalV allows additional variants that are not propagated via context
 */
export type StyledPropsWithContext<
	T extends ElementType,
	CV extends Record<string, unknown>,
	LocalV extends Record<string, Record<string, unknown>> = Record<
		string,
		never
	>,
> = Omit<ComponentPropsWithRef<T>, keyof CV | ExtractVariantKeys<LocalV>> &
	Partial<CV> &
	InferLocalVariantProps<LocalV> & { children?: ReactNode };

/**
 * Config type that requires context
 * Uses the Input generic directly to preserve exact types
 * LocalV allows additional variants that are not propagated via context
 */
export type ConfigWithContext<
	T extends ElementType,
	Input extends StyledContextInput,
	LocalV extends Record<string, Record<string, unknown>> = Record<
		string,
		never
	>,
> = {
	context: StyledContext<Input>;
	base?: VariantProps<T>;
	variants?: ValidatedVariantsConfig<T, Input, LocalV>;
	defaultVariants?: ValidatedDefaultVariants<Input, LocalV>;
	compoundVariants?: Array<
		Partial<InferContextValue<Input>> &
			Partial<InferLocalVariantProps<LocalV>> & { props: VariantProps<T> }
	>;
};

// ============================================================================
// Types for styled() WITHOUT context
// ============================================================================

/**
 * Generic variants config - maps variant names to their possible values
 */
export type VariantsConfig<T extends ElementType> = {
	[variantName: string]: {
		[value: string]: VariantProps<T>;
	};
};

/**
 * Helper to check if a variant has boolean keys (true/false)
 */
export type HasBooleanKeys<V> = "true" extends keyof V
	? true
	: "false" extends keyof V
		? true
		: false;

/**
 * Extract only string literal keys from an object (excludes inherited object methods)
 */
export type StringKeys<V> = Extract<keyof V, string>;

/**
 * Infers the default variants type from the variants config
 * Each key in defaultVariants should only accept keys defined in that variant
 */
export type InferDefaultVariants<V extends VariantsConfig<ElementType>> = {
	[K in keyof V]?: HasBooleanKeys<V[K]> extends true
		? boolean
		: StringKeys<V[K]>;
};

/**
 * Infers variant props from the variants config for component props
 * Excludes 'children' from variant keys to prevent conflicts
 */
export type InferVariantProps<V extends VariantsConfig<ElementType>> = {
	[K in keyof V as K extends "children" ? never : K]?: HasBooleanKeys<
		V[K]
	> extends true
		? boolean
		: StringKeys<V[K]>;
};

/**
 * Compound variant type - all properties optional for better autocomplete
 * Note: props is technically required but marked optional for IDE support
 */
export type CompoundVariant<
	T extends ElementType,
	V extends VariantsConfig<T>,
> = {
	[K in keyof V]?: HasBooleanKeys<V[K]> extends true
		? boolean
		: StringKeys<V[K]>;
} & {
	/** Props to apply when this compound variant matches (required) */
	props?: VariantProps<T>;
};

/**
 * Config type without context - infers types from variants
 */
export type ConfigWithoutContext<
	T extends ElementType,
	V extends VariantsConfig<T>,
> = {
	context?: never;
	base?: VariantProps<T>;
	variants?: V;
	defaultVariants?: InferDefaultVariants<V>;
	compoundVariants?: CompoundVariant<T, V>[];
};

/**
 * Extract actual defined keys from variants (not index signature)
 */
type ExtractVariantKeys<V> =
	V extends Record<infer K, unknown>
		? K extends string
			? string extends K
				? never // Exclude index signature
				: K
			: never
		: never;

/**
 * Props for styled component without context
 * Uses ExtractVariantKeys to get only the actual variant names, not the index signature
 */
export type StyledPropsWithoutContext<
	T extends ElementType,
	V extends VariantsConfig<T>,
> = Omit<ComponentPropsWithRef<T>, ExtractVariantKeys<V>> & {
	[K in ExtractVariantKeys<V>]?: HasBooleanKeys<V[K]> extends true
		? boolean
		: StringKeys<V[K]>;
};

// ============================================================================
// Styled Component Types
// ============================================================================

/**
 * Type for the styled component with context
 */
export type StyledComponentWithContext<
	T extends ElementType,
	Input extends StyledContextInput,
	LocalV extends Record<string, Record<string, unknown>> = Record<
		string,
		never
	>,
> = ((
	props: StyledPropsWithContext<T, InferContextValue<Input>, LocalV>,
) => ReactNode) & {
	displayName?: string;
};

/**
 * Type for the styled component without context
 */
export type StyledComponentWithoutContext<
	T extends ElementType,
	V extends VariantsConfig<T>,
> = ((props: StyledPropsWithoutContext<T, V>) => ReactNode) & {
	displayName?: string;
};
