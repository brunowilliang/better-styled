// Re-export useful React types
export type { ComponentProps, ElementType } from "react"

// Shared types
export type { AllowedProps, VariantProps } from "./shared"

// createStyledContext types
export type {
	InferContextValue,
	StyledContext,
	StyledContextInput,
	VariantOption,
} from "./createStyledContext"

// styled() types
export type {
	CompoundVariant,
	ConfigWithContext,
	ConfigWithoutContext,
	DefaultVariantsFromInput,
	HasBooleanKeys,
	InferDefaultVariants,
	InferVariantProps,
	StringKeys,
	StyledComponentWithContext,
	StyledComponentWithoutContext,
	StyledPropsWithContext,
	StyledPropsWithoutContext,
	VariantsConfig,
	VariantsConfigFromInput,
} from "./styled"

// withSlots types
export type {
	DecoratedComponent,
	SlotProps,
	WithSlotsResult,
} from "./withSlots"
