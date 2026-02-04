/**
 * Benchmarks for createStyledContext()
 *
 * Tests performance of:
 * - Context creation with varying variant counts
 * - Context provider wrapping
 * - useVariants hook access
 */

import { createStyledContext, styled } from "better-styled";
import { bench, group, run } from "mitata";
import { createElement } from "react";

// =============================================================================
// Setup: Create contexts with varying complexity
// =============================================================================

// Simple context - 2 variants
const SimpleContext = createStyledContext({
	variant: ["primary", "secondary"],
	size: ["sm", "md", "lg"],
});

// Medium context - 4 variants with booleans
const MediumContext = createStyledContext({
	variant: ["primary", "secondary", "outline", "ghost"],
	size: ["xs", "sm", "md", "lg", "xl"],
	disabled: ["boolean"],
	loading: ["boolean"],
});

// Complex context - 8 variants
const ComplexContext = createStyledContext({
	variant: ["primary", "secondary", "outline", "ghost", "link", "danger"],
	size: ["xs", "sm", "md", "lg", "xl"],
	rounded: ["none", "sm", "md", "lg", "full"],
	shadow: ["none", "sm", "md", "lg"],
	disabled: ["boolean"],
	loading: ["boolean"],
	fullWidth: ["boolean"],
	iconOnly: ["boolean"],
});

// =============================================================================
// Setup: Create styled components with context
// =============================================================================

const SimpleButtonWithContext = styled("button", {
	context: SimpleContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
		},
		size: {
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

const MediumButtonWithContext = styled("button", {
	context: MediumContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
			outline: { className: "btn-outline" },
			ghost: { className: "btn-ghost" },
		},
		size: {
			xs: { className: "btn-xs" },
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
			xl: { className: "btn-xl" },
		},
		disabled: {
			true: { className: "btn-disabled" },
			false: { className: "" },
		},
		loading: {
			true: { className: "btn-loading" },
			false: { className: "" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		loading: false,
	},
});

const ComplexButtonWithContext = styled("button", {
	context: ComplexContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
			outline: { className: "btn-outline" },
			ghost: { className: "btn-ghost" },
			link: { className: "btn-link" },
			danger: { className: "btn-danger" },
		},
		size: {
			xs: { className: "btn-xs" },
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
			xl: { className: "btn-xl" },
		},
		rounded: {
			none: { className: "rounded-none" },
			sm: { className: "rounded-sm" },
			md: { className: "rounded-md" },
			lg: { className: "rounded-lg" },
			full: { className: "rounded-full" },
		},
		shadow: {
			none: { className: "shadow-none" },
			sm: { className: "shadow-sm" },
			md: { className: "shadow-md" },
			lg: { className: "shadow-lg" },
		},
		disabled: {
			true: { className: "opacity-50" },
			false: { className: "" },
		},
		loading: {
			true: { className: "animate-pulse" },
			false: { className: "" },
		},
		fullWidth: {
			true: { className: "w-full" },
			false: { className: "w-auto" },
		},
		iconOnly: {
			true: { className: "aspect-square" },
			false: { className: "" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		rounded: "md",
		shadow: "none",
		disabled: false,
		loading: false,
		fullWidth: false,
		iconOnly: false,
	},
});

// =============================================================================
// Benchmarks: Context Creation
// =============================================================================

group("createStyledContext() - Creation", () => {
	bench("2 variants", () => {
		createStyledContext({
			variant: ["primary", "secondary"],
			size: ["sm", "md", "lg"],
		});
	}).baseline();

	bench("4 variants with booleans", () => {
		createStyledContext({
			variant: ["primary", "secondary", "outline", "ghost"],
			size: ["xs", "sm", "md", "lg", "xl"],
			disabled: ["boolean"],
			loading: ["boolean"],
		});
	});

	bench("8 variants", () => {
		createStyledContext({
			variant: ["primary", "secondary", "outline", "ghost", "link", "danger"],
			size: ["xs", "sm", "md", "lg", "xl"],
			rounded: ["none", "sm", "md", "lg", "full"],
			shadow: ["none", "sm", "md", "lg"],
			disabled: ["boolean"],
			loading: ["boolean"],
			fullWidth: ["boolean"],
			iconOnly: ["boolean"],
		});
	});

	bench("15 variants (stress test)", () => {
		createStyledContext({
			variant: ["a", "b", "c", "d", "e", "f"],
			size: ["xs", "sm", "md", "lg", "xl"],
			color: ["red", "blue", "green", "yellow"],
			rounded: ["none", "sm", "md", "lg", "full"],
			shadow: ["none", "sm", "md", "lg"],
			opacity: ["25", "50", "75", "100"],
			weight: ["light", "normal", "medium", "bold"],
			disabled: ["boolean"],
			loading: ["boolean"],
			fullWidth: ["boolean"],
			iconOnly: ["boolean"],
			active: ["boolean"],
			focused: ["boolean"],
			selected: ["boolean"],
			hovered: ["boolean"],
		});
	});
});

// =============================================================================
// Benchmarks: styled() with Context
// =============================================================================

group("styled() with Context - Component Creation", () => {
	bench("without context", () => {
		styled("button", {
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
				},
			},
		});
	}).baseline();

	bench("with simple context", () => {
		styled("button", {
			context: SimpleContext,
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
				},
			},
		});
	});

	bench("with complex context", () => {
		styled("button", {
			context: ComplexContext,
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
					outline: { className: "btn-outline" },
					ghost: { className: "btn-ghost" },
					link: { className: "btn-link" },
					danger: { className: "btn-danger" },
				},
				size: {
					xs: { className: "btn-xs" },
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
					xl: { className: "btn-xl" },
				},
				disabled: {
					true: { className: "opacity-50" },
					false: { className: "" },
				},
			},
		});
	});
});

// =============================================================================
// Benchmarks: Render with Context (createElement)
// =============================================================================

group("styled() with Context - Render", () => {
	bench("simple context - default variants", () => {
		createElement(SimpleButtonWithContext, { children: "Click" });
	}).baseline();

	bench("simple context - with variant props (root)", () => {
		createElement(SimpleButtonWithContext, {
			variant: "secondary",
			size: "lg",
			children: "Click",
		});
	});

	bench("medium context - default variants", () => {
		createElement(MediumButtonWithContext, { children: "Click" });
	});

	bench("medium context - all variants specified", () => {
		createElement(MediumButtonWithContext, {
			variant: "ghost",
			size: "xl",
			disabled: true,
			loading: true,
			children: "Click",
		});
	});

	bench("complex context - default variants", () => {
		createElement(ComplexButtonWithContext, { children: "Click" });
	});

	bench("complex context - all variants specified", () => {
		createElement(ComplexButtonWithContext, {
			variant: "danger",
			size: "xl",
			rounded: "full",
			shadow: "lg",
			disabled: true,
			loading: false,
			fullWidth: true,
			iconOnly: false,
			children: "Click",
		});
	});
});

// =============================================================================
// Benchmarks: Nested Components with Context
// =============================================================================

// Simulate nested component tree creation
const createNestedTree = (depth: number) => {
	const components = [];
	for (let i = 0; i < depth; i++) {
		components.push(
			styled("span", {
				context: SimpleContext,
				base: { className: `child-${i}` },
				variants: {
					variant: {
						primary: { className: "text-primary" },
						secondary: { className: "text-secondary" },
					},
					size: {
						sm: { className: "text-sm" },
						md: { className: "text-md" },
						lg: { className: "text-lg" },
					},
				},
			}),
		);
	}
	return components;
};

group("Context Propagation - Nested Components", () => {
	const shallow = createNestedTree(2);
	const medium = createNestedTree(5);
	const deep = createNestedTree(10);

	bench("2 levels deep", () => {
		for (const Comp of shallow) {
			createElement(Comp, { children: "text" });
		}
	}).baseline();

	bench("5 levels deep", () => {
		for (const Comp of medium) {
			createElement(Comp, { children: "text" });
		}
	});

	bench("10 levels deep", () => {
		for (const Comp of deep) {
			createElement(Comp, { children: "text" });
		}
	});
});

// =============================================================================
// Benchmarks: defaultVariants Propagation to Children
// =============================================================================

// Setup: Child components that inherit from context
const SimpleButtonLabel = styled("span", {
	context: SimpleContext,
	base: { className: "btn-label" },
	variants: {
		variant: {
			primary: { className: "label-primary" },
			secondary: { className: "label-secondary" },
		},
		size: {
			sm: { className: "label-sm" },
			md: { className: "label-md" },
			lg: { className: "label-lg" },
		},
	},
});

const MediumButtonLabel = styled("span", {
	context: MediumContext,
	base: { className: "btn-label" },
	variants: {
		variant: {
			primary: { className: "label-primary" },
			secondary: { className: "label-secondary" },
			outline: { className: "label-outline" },
			ghost: { className: "label-ghost" },
		},
		size: {
			xs: { className: "label-xs" },
			sm: { className: "label-sm" },
			md: { className: "label-md" },
			lg: { className: "label-lg" },
			xl: { className: "label-xl" },
		},
	},
});

const ComplexButtonLabel = styled("span", {
	context: ComplexContext,
	base: { className: "btn-label" },
	variants: {
		variant: {
			primary: { className: "label-primary" },
			secondary: { className: "label-secondary" },
			outline: { className: "label-outline" },
			ghost: { className: "label-ghost" },
			link: { className: "label-link" },
			danger: { className: "label-danger" },
		},
		size: {
			xs: { className: "label-xs" },
			sm: { className: "label-sm" },
			md: { className: "label-md" },
			lg: { className: "label-lg" },
			xl: { className: "label-xl" },
		},
	},
});

group("defaultVariants Propagation - Parent to Child", () => {
	// Baseline: Parent with explicit props
	bench("simple - parent with explicit props", () => {
		createElement(
			SimpleButtonWithContext,
			{ variant: "primary", size: "md" },
			createElement(SimpleButtonLabel, null, "Click"),
		);
	}).baseline();

	// Test: Parent using only defaultVariants (no props)
	bench("simple - parent with defaultVariants only", () => {
		createElement(
			SimpleButtonWithContext,
			null,
			createElement(SimpleButtonLabel, null, "Click"),
		);
	});

	bench("medium - parent with explicit props", () => {
		createElement(
			MediumButtonWithContext,
			{ variant: "primary", size: "md", disabled: false, loading: false },
			createElement(MediumButtonLabel, null, "Click"),
		);
	});

	bench("medium - parent with defaultVariants only", () => {
		createElement(
			MediumButtonWithContext,
			null,
			createElement(MediumButtonLabel, null, "Click"),
		);
	});

	bench("complex - parent with explicit props", () => {
		createElement(
			ComplexButtonWithContext,
			{
				variant: "primary",
				size: "md",
				rounded: "md",
				shadow: "none",
				disabled: false,
				loading: false,
				fullWidth: false,
				iconOnly: false,
			},
			createElement(ComplexButtonLabel, null, "Click"),
		);
	});

	bench("complex - parent with defaultVariants only", () => {
		createElement(
			ComplexButtonWithContext,
			null,
			createElement(ComplexButtonLabel, null, "Click"),
		);
	});
});

// =============================================================================
// Benchmarks: Local Variants (Non-Propagated)
// =============================================================================

// Context for local variants testing
const LocalTestContext = createStyledContext({
	variant: ["primary", "secondary"],
	size: ["sm", "md", "lg"],
	disabled: ["boolean"],
});

// Baseline: All variants in context (no local variants)
const ButtonAllContext = styled("button", {
	context: LocalTestContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
		},
		size: {
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
		},
		disabled: {
			true: { className: "btn-disabled" },
			false: { className: "btn-enabled" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
	},
});

// With 1 local variant
const ButtonWith1Local = styled("button", {
	context: LocalTestContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
		},
		size: {
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
		},
		disabled: {
			true: { className: "btn-disabled" },
			false: { className: "btn-enabled" },
		},
		// Local variant (not in context)
		fullWidth: {
			true: { className: "w-full" },
			false: { className: "w-auto" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		fullWidth: false,
	},
});

// With 3 local variants
const ButtonWith3Local = styled("button", {
	context: LocalTestContext,
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
		},
		size: {
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
		},
		disabled: {
			true: { className: "btn-disabled" },
			false: { className: "btn-enabled" },
		},
		// Local variants (not in context)
		fullWidth: {
			true: { className: "w-full" },
			false: { className: "w-auto" },
		},
		rounded: {
			sm: { className: "rounded-sm" },
			lg: { className: "rounded-lg" },
		},
		shadow: {
			none: { className: "shadow-none" },
			md: { className: "shadow-md" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		fullWidth: false,
		rounded: "sm",
		shadow: "none",
	},
});

// Child that uses only context variants
const LocalChildLabel = styled("span", {
	context: LocalTestContext,
	base: { className: "btn-label" },
	variants: {
		variant: {
			primary: { className: "label-primary" },
			secondary: { className: "label-secondary" },
		},
		size: {
			sm: { className: "label-sm" },
			md: { className: "label-md" },
			lg: { className: "label-lg" },
		},
	},
});

group("Local Variants - Filtering Overhead", () => {
	bench("no local variants (baseline)", () => {
		createElement(ButtonAllContext, {
			variant: "primary",
			size: "md",
			children: "Click",
		});
	}).baseline();

	bench("1 local variant", () => {
		createElement(ButtonWith1Local, {
			variant: "primary",
			size: "md",
			fullWidth: true,
			children: "Click",
		});
	});

	bench("3 local variants", () => {
		createElement(ButtonWith3Local, {
			variant: "primary",
			size: "md",
			fullWidth: true,
			rounded: "lg",
			shadow: "md",
			children: "Click",
		});
	});
});

group("Local Variants - Parent to Child Propagation", () => {
	bench("no local - parent with child", () => {
		createElement(
			ButtonAllContext,
			{ variant: "primary", size: "lg" },
			createElement(LocalChildLabel, null, "Click"),
		);
	}).baseline();

	bench("1 local - parent with child (local not propagated)", () => {
		createElement(
			ButtonWith1Local,
			{ variant: "primary", size: "lg", fullWidth: true },
			createElement(LocalChildLabel, null, "Click"),
		);
	});

	bench("3 local - parent with child (locals not propagated)", () => {
		createElement(
			ButtonWith3Local,
			{
				variant: "primary",
				size: "lg",
				fullWidth: true,
				rounded: "lg",
				shadow: "md",
			},
			createElement(LocalChildLabel, null, "Click"),
		);
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
