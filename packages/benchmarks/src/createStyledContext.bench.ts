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
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
