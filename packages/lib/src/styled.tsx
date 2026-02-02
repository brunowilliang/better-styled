import {
	type ComponentProps,
	createElement,
	type ElementType,
	type ReactNode,
} from "react"
import type { VariantProps } from "./types/shared"
import type {
	InferContextValue,
	StyledContext,
	StyledContextInput,
} from "./types/createStyledContext"
import type {
	ConfigWithContext,
	ConfigWithoutContext,
	StyledPropsWithContext,
	StyledPropsWithoutContext,
	VariantsConfig,
} from "./types/styled"
import {
	mergeFinalProps,
	resolveCompoundVariantProps,
	resolveVariantProps,
} from "./utils"

// ============================================================================
// Overloads
// ============================================================================

/**
 * Creates a styled component with variant support and context.
 * This overload is selected when config has a `context` property.
 *
 * The key trick here is using `Input extends StyledContextInput` as the
 * primary generic, and inferring it from `config.context.variantKeys`.
 * This allows TypeScript to preserve the exact literal types.
 */
export function styled<
	T extends ElementType,
	const Input extends StyledContextInput,
>(
	component: T,
	config: ConfigWithContext<T, Input>,
): ((props: StyledPropsWithContext<T, InferContextValue<Input>>) => ReactNode) & {
	displayName?: string
}

/**
 * Creates a styled component with variant support without context.
 * This overload is selected when config does NOT have a `context` property.
 *
 * The key trick here is using `const V` to infer the exact variant keys and values.
 */
export function styled<
	T extends ElementType,
	const V extends VariantsConfig<T>,
>(
	component: T,
	config: ConfigWithoutContext<T, V>,
): ((props: StyledPropsWithoutContext<T, V>) => ReactNode) & {
	displayName?: string
}

/**
 * Implementation
 */
export function styled<T extends ElementType>(
	component: T,
	config: Record<string, unknown>,
) {
	const context = config.context as StyledContext<StyledContextInput> | undefined
	const base = config.base as VariantProps<T> | undefined
	const variants = config.variants as Record<string, Record<string, unknown>> | undefined
	const defaultVariants = config.defaultVariants as Record<string, string | boolean> | undefined
	const compoundVariants = config.compoundVariants as
		| Array<Record<string, unknown> & { props: Record<string, unknown> }>
		| undefined

	const variantKeys = variants ? new Set(Object.keys(variants)) : new Set<string>()

	const StyledComponent = (incomingProps: Record<string, unknown>) => {
		// Get variants from context if available
		const contextVariants = context?.useVariants() ?? {}

		// Initialize active variants: component defaults -> context values
		const activeVariants: Record<string, string | boolean> = {
			...defaultVariants,
			...(contextVariants as Record<string, string | boolean>),
		}

		// Separate variant props from direct props
		const directProps: Record<string, unknown> = {}

		// Track if this component received any variant props (makes it the root)
		let hasVariantProps = false

		for (const [key, value] of Object.entries(incomingProps)) {
			if (variantKeys.has(key) && value !== undefined) {
				activeVariants[key] = value as string | boolean
				hasVariantProps = true
			} else {
				directProps[key] = value
			}
		}

		// Resolve props from variants
		const variantResolvedProps = resolveVariantProps<T>(variants, activeVariants)

		// Resolve props from compound variants
		const compoundResolvedProps = resolveCompoundVariantProps<T>(
			compoundVariants,
			activeVariants,
		)

		// Merge all props: base -> variants -> compounds -> direct
		const finalProps = mergeFinalProps<ComponentProps<T>>(
			base as Partial<ComponentProps<T>>,
			variantResolvedProps as Partial<ComponentProps<T>>,
			compoundResolvedProps as Partial<ComponentProps<T>>,
			directProps as Partial<ComponentProps<T>>,
		)

		const element = createElement(component, finalProps)

		// If has context AND is root component (received variant props), wrap with Provider
		if (context && hasVariantProps) {
			return createElement(
				context.Provider,
				{ value: activeVariants as never },
				element,
			)
		}

		return element
	}

	// Set display name for React DevTools
	const componentName =
		typeof component === "string"
			? component
			: component.displayName || component.name || "Component"
	StyledComponent.displayName = `Styled(${componentName})`

	return StyledComponent
}
