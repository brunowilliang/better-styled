import type { ComponentProps, ElementType, ReactNode } from "react";
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
 * Props for styled component with context
 * Explicitly includes children to ensure it's always available
 */
export type StyledPropsWithContext<
	T extends ElementType,
	CV extends Record<string, unknown>,
> = Omit<ComponentProps<T>, keyof CV> & Partial<CV> & { children?: ReactNode };

/**
 * Config type that requires context
 * Uses the Input generic directly to preserve exact types
 */
export type ConfigWithContext<
	T extends ElementType,
	Input extends StyledContextInput,
> = {
	context: StyledContext<Input>;
	base?: VariantProps<T>;
	variants?: VariantsConfigFromInput<T, Input>;
	defaultVariants?: DefaultVariantsFromInput<Input>;
	compoundVariants?: Array<
		Partial<InferContextValue<Input>> & { props: VariantProps<T> }
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
> = Omit<ComponentProps<T>, ExtractVariantKeys<V>> & {
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
> = ((
	props: StyledPropsWithContext<T, InferContextValue<Input>>,
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
