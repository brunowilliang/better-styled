import type { ComponentProps, ElementType } from "react"

/**
 * Allowed props that can be passed to styled components.
 * Includes standard React props plus data-* attributes.
 */
export type AllowedProps<T extends ElementType> = ComponentProps<T> & {
	[key: `data-${string}`]: unknown
}

/**
 * Props configuration for a single variant value.
 */
export type VariantProps<T extends ElementType> = Partial<AllowedProps<T>>
