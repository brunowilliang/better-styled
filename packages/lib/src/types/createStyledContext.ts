import type { Context } from "react"

/**
 * Variant option type - use "boolean" for boolean variants
 * The (string & {}) trick preserves autocomplete for "boolean" while allowing any string
 */
export type VariantOption = "boolean" | (string & {})

/**
 * Input type for createStyledContext - accepts arrays of string options
 * Special case: ["boolean"] marks a boolean variant
 */
export type StyledContextInput = Record<string, readonly VariantOption[]>

/**
 * Converts array input to union type
 * { variant: ["a", "b"] } → { variant: "a" | "b" }
 * { disabled: ["boolean"] } → { disabled: boolean }
 */
export type InferContextValue<T extends StyledContextInput> = {
	[K in keyof T]: T[K] extends readonly ["boolean"] ? boolean : T[K][number]
}

/**
 * Represents a styled context for sharing variant values between components
 */
export type StyledContext<T extends StyledContextInput> = {
	Context: Context<InferContextValue<T> | null>
	Provider: Context<InferContextValue<T> | null>["Provider"]
	useVariants: () => InferContextValue<T> | null
	/** The variant keys and their possible values (arrays) */
	variantKeys: T
}
