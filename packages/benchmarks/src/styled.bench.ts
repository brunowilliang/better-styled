/**
 * Benchmarks for styled() function
 *
 * Tests performance of:
 * - Component creation with varying complexity
 * - Variant resolution
 * - Compound variant matching
 * - Props merging and className composition
 */

import { styled } from "better-styled";
import { bench, group, run } from "mitata";
import { createElement } from "react";

// =============================================================================
// Setup: Create components with varying complexity
// =============================================================================

// Simple component - no variants
const SimpleButton = styled("button", {
	base: { className: "btn" },
});

// Basic variants - 2 variants, 3 options each
const BasicButton = styled("button", {
	base: { className: "btn" },
	variants: {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
			outline: { className: "btn-outline" },
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

// Medium complexity - 4 variants with compound variants
const MediumButton = styled("button", {
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
			true: { className: "btn-disabled opacity-50" },
			false: { className: "" },
		},
		loading: {
			true: { className: "btn-loading animate-pulse" },
			false: { className: "" },
		},
	},
	compoundVariants: [
		{
			variant: "primary",
			disabled: true,
			props: { className: "bg-blue-300" },
		},
		{
			variant: "secondary",
			disabled: true,
			props: { className: "bg-gray-300" },
		},
		{
			variant: "primary",
			loading: true,
			props: { className: "cursor-wait" },
		},
	],
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		loading: false,
	},
});

// High complexity - 8 variants with 10+ compound variants
const ComplexButton = styled("button", {
	base: { className: "btn font-medium transition-all duration-200" },
	variants: {
		variant: {
			primary: { className: "btn-primary bg-blue-500 text-white" },
			secondary: { className: "btn-secondary bg-gray-500 text-white" },
			outline: { className: "btn-outline border-2 bg-transparent" },
			ghost: { className: "btn-ghost bg-transparent hover:bg-gray-100" },
			link: { className: "btn-link underline hover:no-underline" },
			danger: { className: "btn-danger bg-red-500 text-white" },
		},
		size: {
			xs: { className: "btn-xs text-xs px-2 py-1" },
			sm: { className: "btn-sm text-sm px-3 py-1.5" },
			md: { className: "btn-md text-base px-4 py-2" },
			lg: { className: "btn-lg text-lg px-5 py-2.5" },
			xl: { className: "btn-xl text-xl px-6 py-3" },
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
			true: { className: "opacity-50 cursor-not-allowed" },
			false: { className: "" },
		},
		loading: {
			true: { className: "animate-pulse cursor-wait" },
			false: { className: "" },
		},
		fullWidth: {
			true: { className: "w-full" },
			false: { className: "w-auto" },
		},
		iconOnly: {
			true: { className: "aspect-square p-0" },
			false: { className: "" },
		},
	},
	compoundVariants: [
		{ variant: "primary", disabled: true, props: { className: "bg-blue-300" } },
		{
			variant: "secondary",
			disabled: true,
			props: { className: "bg-gray-300" },
		},
		{ variant: "danger", disabled: true, props: { className: "bg-red-300" } },
		{ variant: "primary", loading: true, props: { className: "bg-blue-400" } },
		{ variant: "outline", size: "xs", props: { className: "border" } },
		{ variant: "outline", size: "sm", props: { className: "border" } },
		{ variant: "ghost", size: "lg", props: { className: "hover:bg-gray-200" } },
		{ variant: "ghost", size: "xl", props: { className: "hover:bg-gray-200" } },
		{
			variant: "link",
			disabled: true,
			props: { className: "no-underline text-gray-400" },
		},
		{ iconOnly: true, size: "xs", props: { className: "w-6 h-6" } },
		{ iconOnly: true, size: "sm", props: { className: "w-8 h-8" } },
		{ iconOnly: true, size: "md", props: { className: "w-10 h-10" } },
		{ iconOnly: true, size: "lg", props: { className: "w-12 h-12" } },
		{ iconOnly: true, size: "xl", props: { className: "w-14 h-14" } },
	],
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
// Benchmarks: Component Creation
// =============================================================================

group("styled() - Component Creation", () => {
	bench("no variants", () => {
		styled("button", {
			base: { className: "btn" },
		});
	}).baseline();

	bench("2 variants (3 options each)", () => {
		styled("button", {
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
					outline: { className: "btn-outline" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
				},
			},
		});
	});

	bench("4 variants + 3 compounds", () => {
		styled("button", {
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
					outline: { className: "btn-outline" },
					ghost: { className: "btn-ghost" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
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
			compoundVariants: [
				{
					variant: "primary",
					disabled: true,
					props: { className: "bg-blue-300" },
				},
				{
					variant: "secondary",
					disabled: true,
					props: { className: "bg-gray-300" },
				},
				{
					variant: "primary",
					loading: true,
					props: { className: "cursor-wait" },
				},
			],
		});
	});

	bench("8 variants + 14 compounds", () => {
		styled("button", {
			base: { className: "btn font-medium transition-all" },
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
			compoundVariants: [
				{
					variant: "primary",
					disabled: true,
					props: { className: "bg-blue-300" },
				},
				{
					variant: "secondary",
					disabled: true,
					props: { className: "bg-gray-300" },
				},
				{
					variant: "danger",
					disabled: true,
					props: { className: "bg-red-300" },
				},
				{
					variant: "primary",
					loading: true,
					props: { className: "bg-blue-400" },
				},
				{ variant: "outline", size: "xs", props: { className: "border" } },
				{ variant: "outline", size: "sm", props: { className: "border" } },
				{
					variant: "ghost",
					size: "lg",
					props: { className: "hover:bg-gray-200" },
				},
				{
					variant: "ghost",
					size: "xl",
					props: { className: "hover:bg-gray-200" },
				},
				{
					variant: "link",
					disabled: true,
					props: { className: "no-underline" },
				},
				{ iconOnly: true, size: "xs", props: { className: "w-6 h-6" } },
				{ iconOnly: true, size: "sm", props: { className: "w-8 h-8" } },
				{ iconOnly: true, size: "md", props: { className: "w-10 h-10" } },
				{ iconOnly: true, size: "lg", props: { className: "w-12 h-12" } },
				{ iconOnly: true, size: "xl", props: { className: "w-14 h-14" } },
			],
		});
	});
});

// =============================================================================
// Benchmarks: Render Performance (createElement)
// =============================================================================

group("styled() - Render (createElement)", () => {
	bench("simple - no variants", () => {
		createElement(SimpleButton, { children: "Click" });
	}).baseline();

	bench("basic - default variants", () => {
		createElement(BasicButton, { children: "Click" });
	});

	bench("basic - with variant props", () => {
		createElement(BasicButton, {
			variant: "secondary",
			size: "lg",
			children: "Click",
		});
	});

	bench("medium - default variants", () => {
		createElement(MediumButton, { children: "Click" });
	});

	bench("medium - with variant props", () => {
		createElement(MediumButton, {
			variant: "secondary",
			size: "lg",
			disabled: true,
			children: "Click",
		});
	});

	bench("medium - compound variant match", () => {
		createElement(MediumButton, {
			variant: "primary",
			disabled: true,
			children: "Click",
		});
	});

	bench("complex - default variants", () => {
		createElement(ComplexButton, { children: "Click" });
	});

	bench("complex - all variants specified", () => {
		createElement(ComplexButton, {
			variant: "danger",
			size: "xl",
			rounded: "full",
			shadow: "lg",
			disabled: false,
			loading: false,
			fullWidth: true,
			iconOnly: false,
			children: "Click",
		});
	});

	bench("complex - multiple compound matches", () => {
		createElement(ComplexButton, {
			variant: "primary",
			size: "lg",
			disabled: true,
			loading: true,
			children: "Click",
		});
	});
});

// =============================================================================
// Benchmarks: Props Merging
// =============================================================================

group("styled() - Props Merging", () => {
	bench("className only", () => {
		createElement(BasicButton, { className: "custom-class" });
	}).baseline();

	bench("className + onClick", () => {
		createElement(BasicButton, {
			className: "custom-class",
			onClick: () => {},
		});
	});

	bench("className + style object", () => {
		createElement(BasicButton, {
			className: "custom-class",
			style: { backgroundColor: "red", padding: 10 },
		});
	});

	bench("multiple className merges", () => {
		createElement(ComplexButton, {
			variant: "primary",
			disabled: true,
			className: "extra-class another-class",
		});
	});

	bench("conflicting tailwind classes", () => {
		createElement(ComplexButton, {
			variant: "primary",
			className: "bg-red-500 text-black px-8",
		});
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
