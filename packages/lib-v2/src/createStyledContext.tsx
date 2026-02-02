import { createContext, useContext } from "react"
import type {
	InferContextValue,
	StyledContext,
	StyledContextInput,
} from "./types/createStyledContext"

/**
 * Creates a styled context for sharing variant values between parent and child components.
 *
 * @param variants - Object with variant names as keys and arrays of possible values
 * @returns A StyledContext object with Context, Provider, useVariants hook, and variantKeys
 *
 * @example
 * const ButtonContext = createStyledContext({
 *   variant: ["primary", "secondary", "outline"],
 *   size: ["sm", "md", "lg"],
 *   disabled: ["boolean"],  // Special marker for boolean variants
 * })
 *
 * const StyledButton = styled(Pressable, {
 *   context: ButtonContext,
 *   variants: {
 *     variant: { primary: {...}, secondary: {...} },
 *     size: { sm: {...}, md: {...}, lg: {...} },
 *     disabled: { true: {...}, false: {...} },
 *   },
 *   defaultVariants: {
 *     variant: "primary",
 *     size: "md",
 *     disabled: false,
 *   },
 * })
 */
export const createStyledContext = <const T extends StyledContextInput>(
	variants: T,
): StyledContext<T> => {
	const Context = createContext<InferContextValue<T> | null>(null)

	return {
		Context,
		Provider: Context.Provider,
		useVariants: () => useContext(Context),
		variantKeys: variants,
	}
}
