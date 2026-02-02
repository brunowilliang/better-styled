export { createStyledContext } from "./src/createStyledContext";
export { styled } from "./src/styled";
// Export types for consumers
export type {
	// Shared
	AllowedProps,
	// styled
	CompoundVariant,
	ConfigWithContext,
	ConfigWithoutContext,
	// withSlots
	DecoratedComponent,
	// createStyledContext
	InferContextValue,
	SlotProps,
	StyledComponentWithContext,
	StyledComponentWithoutContext,
	StyledContext,
	StyledContextInput,
	VariantProps,
	VariantsConfig,
	WithSlotsResult,
} from "./src/types";

// Export utilities for advanced usage
export { cn, mergeFinalProps, mergeStyles } from "./src/utils";
export { withSlots } from "./src/withSlots";
