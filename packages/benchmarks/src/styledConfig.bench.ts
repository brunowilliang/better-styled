/**
 * Benchmarks for styledConfig() function
 *
 * Tests overhead of the identity function compared to direct object creation.
 * styledConfig() should have near-zero overhead since it just returns the config.
 */

import { createStyledContext, styledConfig } from "better-styled";
import { bench, group, run } from "mitata";

// =============================================================================
// Setup
// =============================================================================

const ctx = createStyledContext({
	variant: ["primary", "secondary", "outline", "ghost", "link"],
	size: ["xs", "sm", "md", "lg", "xl"],
	disabled: ["boolean"],
});

// =============================================================================
// styledConfig - Overhead
// =============================================================================

group("styledConfig - Overhead vs direct object", () => {
	bench("direct object creation", () => {
		const _config = {
			context: ctx,
			base: { className: "btn font-medium" },
			variants: {
				variant: {
					primary: { className: "bg-blue-500 text-white" },
					secondary: { className: "bg-gray-500 text-white" },
				},
				size: {
					sm: { className: "px-2 py-1 text-sm" },
					lg: { className: "px-6 py-3 text-lg" },
				},
			},
			defaultVariants: {
				variant: "primary",
				size: "sm",
			},
		};
	}).baseline();

	bench("styledConfig with same config", () => {
		styledConfig(["button", "button"], {
			context: ctx,
			base: { className: "btn font-medium" },
			variants: {
				variant: {
					primary: { className: "bg-blue-500 text-white" },
					secondary: { className: "bg-gray-500 text-white" },
				},
				size: {
					sm: { className: "px-2 py-1 text-sm" },
					lg: { className: "px-6 py-3 text-lg" },
				},
			},
			defaultVariants: {
				variant: "primary",
				size: "sm",
			},
		});
	});
});

group("styledConfig - Config complexity", () => {
	bench("simple: base only", () => {
		styledConfig(["button", "button"], {
			context: ctx,
			base: { className: "btn" },
			variants: {},
		});
	}).baseline();

	bench("medium: base + variants + defaults", () => {
		styledConfig(["button", "button"], {
			context: ctx,
			base: { className: "btn font-medium transition-all" },
			variants: {
				variant: {
					primary: { className: "bg-blue-500 text-white" },
					secondary: { className: "bg-gray-500 text-white" },
					outline: { className: "border border-gray-300" },
				},
				size: {
					sm: { className: "px-2 py-1 text-sm" },
					md: { className: "px-4 py-2 text-base" },
					lg: { className: "px-6 py-3 text-lg" },
				},
			},
			defaultVariants: {
				variant: "primary",
				size: "md",
			},
		});
	});

	bench("full: base + variants + defaults + compounds", () => {
		styledConfig(["button", "button"], {
			context: ctx,
			base: { className: "btn font-medium transition-all" },
			variants: {
				variant: {
					primary: { className: "bg-blue-500 text-white" },
					secondary: { className: "bg-gray-500 text-white" },
					outline: { className: "border border-gray-300" },
					ghost: { className: "bg-transparent" },
					link: { className: "underline" },
				},
				size: {
					xs: { className: "px-1 py-0.5 text-xs" },
					sm: { className: "px-2 py-1 text-sm" },
					md: { className: "px-4 py-2 text-base" },
					lg: { className: "px-6 py-3 text-lg" },
					xl: { className: "px-8 py-4 text-xl" },
				},
				disabled: {
					true: { className: "opacity-50 cursor-not-allowed" },
					false: { className: "opacity-100 cursor-pointer" },
				},
			},
			defaultVariants: {
				variant: "primary",
				size: "md",
				disabled: false,
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
					size: "lg",
					props: { className: "shadow-lg" },
				},
				{
					variant: "ghost",
					size: "sm",
					props: { className: "text-gray-400" },
				},
				{
					variant: "link",
					disabled: true,
					props: { className: "no-underline text-gray-400" },
				},
			],
		});
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
