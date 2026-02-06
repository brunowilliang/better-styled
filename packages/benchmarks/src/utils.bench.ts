/**
 * Benchmarks for utility functions
 *
 * Tests performance of:
 * - mergeFinalProps: Props merging from multiple sources
 * - mergeStyles: Style object merging
 * - resolveVariantProps: Variant resolution based on active values
 * - resolveCompoundVariantProps: Compound variant matching
 */

import {
	mergeFinalProps,
	mergeStyles,
	resolveCompoundVariantProps,
	resolveVariantProps,
} from "better-styled";
import { bench, group, run } from "mitata";

// =============================================================================
// mergeStyles Benchmarks
// =============================================================================

group("mergeStyles - Performance", () => {
	const style1 = { padding: 10, margin: 5 };
	const style2 = { padding: 20, color: "red" };
	const style3 = { backgroundColor: "blue", border: "1px solid" };
	const style4 = { fontSize: 14, lineHeight: 1.5 };

	bench("2 style objects", () => {
		mergeStyles(style1, style2);
	}).baseline();

	bench("4 style objects", () => {
		mergeStyles(style1, style2, style3, style4);
	});

	bench("with undefined values", () => {
		mergeStyles(style1, undefined, style2, undefined, style3);
	});

	bench("large style objects (10 properties each)", () => {
		const large1 = {
			padding: 10,
			margin: 5,
			color: "red",
			backgroundColor: "blue",
			fontSize: 14,
			lineHeight: 1.5,
			fontWeight: "bold",
			textAlign: "center",
			display: "flex",
			position: "relative",
		};
		const large2 = {
			padding: 20,
			margin: 10,
			color: "green",
			backgroundColor: "white",
			fontSize: 16,
			lineHeight: 1.6,
			fontWeight: "normal",
			textAlign: "left",
			display: "block",
			position: "absolute",
		};
		mergeStyles(large1, large2);
	});
});

// =============================================================================
// mergeFinalProps Benchmarks
// =============================================================================

group("mergeFinalProps - Performance", () => {
	const source1 = { className: "class-1" };
	const source2 = { className: "class-2" };
	const source3 = { className: "class-3" };
	const source4 = { className: "class-4" };

	bench("2 sources, className only", () => {
		mergeFinalProps(source1, source2);
	}).baseline();

	bench("4 sources, className only", () => {
		mergeFinalProps(source1, source2, source3, source4);
	});

	bench("2 sources, className + style", () => {
		mergeFinalProps<Record<string, unknown>>(
			{ className: "class-1", style: { padding: 10 } },
			{ className: "class-2", style: { margin: 5 } },
		);
	});

	bench("4 sources, className + style", () => {
		mergeFinalProps<Record<string, unknown>>(
			{ className: "class-1", style: { padding: 10 } },
			{ className: "class-2", style: { margin: 5 } },
			{ className: "class-3", style: { color: "red" } },
			{ className: "class-4", style: { fontSize: 14 } },
		);
	});

	bench("with onClick composition", () => {
		mergeFinalProps(
			{ className: "class-1", onClick: () => {} },
			{ className: "class-2", onClick: () => {} },
			{ className: "class-3", onClick: () => {} },
		);
	});

	bench("complex: className + style + onClick + props", () => {
		mergeFinalProps<Record<string, unknown>>(
			{
				className: "base btn",
				style: { padding: 10 },
				onClick: () => {},
				disabled: false,
			},
			{
				className: "variant-primary",
				style: { backgroundColor: "blue" },
				onClick: () => {},
			},
			{
				className: "compound-match",
				style: { fontWeight: "bold" },
			},
			{
				className: "user-class",
				style: { margin: 20 },
				onClick: () => {},
				disabled: true,
				"data-testid": "btn",
			},
		);
	});

	bench("tailwind conflict resolution", () => {
		mergeFinalProps(
			{ className: "p-4 m-4 text-sm bg-blue-500" },
			{ className: "p-8 text-lg" },
			{ className: "p-12 bg-red-500" },
		);
	});

	bench("heavy tailwind conflict (10+ classes)", () => {
		mergeFinalProps(
			{ className: "p-4 m-4 text-sm bg-blue-500 rounded-md shadow-sm" },
			{ className: "p-8 m-8 text-lg bg-red-500 rounded-lg shadow-md" },
			{ className: "p-12 m-12 text-xl bg-green-500 rounded-xl shadow-lg" },
		);
	});
});

// =============================================================================
// resolveVariantProps Benchmarks
// =============================================================================

group("resolveVariantProps - Performance", () => {
	// Small: 2 variants
	const smallVariants = {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
		},
		size: {
			sm: { className: "btn-sm" },
			lg: { className: "btn-lg" },
		},
	};

	// Medium: 5 variants
	const mediumVariants = {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
			outline: { className: "btn-outline" },
		},
		size: {
			xs: { className: "btn-xs" },
			sm: { className: "btn-sm" },
			md: { className: "btn-md" },
			lg: { className: "btn-lg" },
		},
		disabled: {
			true: { className: "btn-disabled" },
			false: { className: "btn-enabled" },
		},
		loading: {
			true: { className: "btn-loading" },
			false: { className: "" },
		},
		rounded: {
			true: { className: "rounded-full" },
			false: { className: "rounded-md" },
		},
	};

	// Large: 10 variants
	const largeVariants = {
		variant: {
			primary: { className: "btn-primary" },
			secondary: { className: "btn-secondary" },
			outline: { className: "btn-outline" },
			ghost: { className: "btn-ghost" },
			link: { className: "btn-link" },
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
			false: { className: "opacity-100" },
		},
		loading: {
			true: { className: "animate-pulse" },
			false: { className: "" },
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
		fullWidth: {
			true: { className: "w-full" },
			false: { className: "w-auto" },
		},
		iconOnly: {
			true: { className: "aspect-square" },
			false: { className: "" },
		},
		color: {
			red: { className: "text-red-500" },
			blue: { className: "text-blue-500" },
			green: { className: "text-green-500" },
		},
		border: {
			true: { className: "border" },
			false: { className: "border-0" },
		},
	};

	bench("2 variants, 1 active", () => {
		resolveVariantProps(smallVariants, { variant: "primary" });
	}).baseline();

	bench("2 variants, 2 active", () => {
		resolveVariantProps(smallVariants, { variant: "primary", size: "lg" });
	});

	bench("5 variants, 3 active", () => {
		resolveVariantProps(mediumVariants, {
			variant: "primary",
			size: "lg",
			disabled: true,
		});
	});

	bench("5 variants, 5 active", () => {
		resolveVariantProps(mediumVariants, {
			variant: "primary",
			size: "lg",
			disabled: true,
			loading: false,
			rounded: true,
		});
	});

	bench("10 variants, 5 active", () => {
		resolveVariantProps(largeVariants, {
			variant: "primary",
			size: "lg",
			disabled: false,
			loading: true,
			rounded: "full",
		});
	});

	bench("10 variants, 10 active", () => {
		resolveVariantProps(largeVariants, {
			variant: "primary",
			size: "lg",
			disabled: false,
			loading: true,
			rounded: "full",
			shadow: "lg",
			fullWidth: true,
			iconOnly: false,
			color: "blue",
			border: true,
		});
	});
});

// =============================================================================
// resolveCompoundVariantProps Benchmarks
// =============================================================================

group("resolveCompoundVariantProps - Performance", () => {
	// Small: 3 compounds
	const smallCompounds = [
		{ variant: "primary", size: "lg", props: { className: "compound-1" } },
		{ variant: "primary", disabled: true, props: { className: "compound-2" } },
		{ variant: "danger", size: "sm", props: { className: "compound-3" } },
	];

	// Medium: 5 compounds
	const mediumCompounds = [
		{ variant: "primary", size: "lg", props: { className: "compound-1" } },
		{ variant: "primary", disabled: true, props: { className: "compound-2" } },
		{ variant: "danger", size: "sm", props: { className: "compound-3" } },
		{ variant: "secondary", loading: true, props: { className: "compound-4" } },
		{
			variant: "outline",
			size: "lg",
			rounded: true,
			props: { className: "compound-5" },
		},
	];

	// Large: 10 compounds
	const largeCompounds = [
		{ variant: "primary", size: "lg", props: { className: "compound-1" } },
		{ variant: "primary", disabled: true, props: { className: "compound-2" } },
		{ variant: "danger", size: "sm", props: { className: "compound-3" } },
		{ variant: "secondary", loading: true, props: { className: "compound-4" } },
		{
			variant: "outline",
			size: "lg",
			rounded: true,
			props: { className: "compound-5" },
		},
		{
			variant: "ghost",
			size: "xl",
			shadow: "lg",
			props: { className: "compound-6" },
		},
		{ variant: "link", disabled: true, props: { className: "compound-7" } },
		{
			variant: "primary",
			size: "sm",
			loading: true,
			props: { className: "compound-8" },
		},
		{
			variant: "danger",
			disabled: true,
			iconOnly: true,
			props: { className: "compound-9" },
		},
		{
			variant: "secondary",
			size: "lg",
			fullWidth: true,
			props: { className: "compound-10" },
		},
	];

	bench("3 compounds, 0 matches", () => {
		resolveCompoundVariantProps(smallCompounds, {
			variant: "secondary",
			size: "md",
		});
	}).baseline();

	bench("3 compounds, 1 match", () => {
		resolveCompoundVariantProps(smallCompounds, {
			variant: "primary",
			size: "lg",
		});
	});

	bench("3 compounds, 2 matches", () => {
		resolveCompoundVariantProps(smallCompounds, {
			variant: "primary",
			size: "lg",
			disabled: true,
		});
	});

	bench("5 compounds, 0 matches", () => {
		resolveCompoundVariantProps(mediumCompounds, {
			variant: "ghost",
			size: "md",
		});
	});

	bench("5 compounds, 2 matches", () => {
		resolveCompoundVariantProps(mediumCompounds, {
			variant: "primary",
			size: "lg",
			disabled: true,
		});
	});

	bench("10 compounds, 0 matches", () => {
		resolveCompoundVariantProps(largeCompounds, {
			variant: "ghost",
			size: "md",
			loading: false,
		});
	});

	bench("10 compounds, 3 matches", () => {
		resolveCompoundVariantProps(largeCompounds, {
			variant: "primary",
			size: "lg",
			disabled: true,
			loading: true,
		});
	});

	bench("10 compounds, 5 matches", () => {
		resolveCompoundVariantProps(largeCompounds, {
			variant: "primary",
			size: "lg",
			disabled: true,
			loading: true,
			iconOnly: false,
			fullWidth: false,
		});
	});
});

// =============================================================================
// Integration: Full Resolution Flow
// =============================================================================

group("Integration - Full Resolution Flow", () => {
	const base = { className: "btn font-medium transition-all" };

	const variants = {
		variant: {
			primary: { className: "bg-blue-500 text-white" },
			secondary: { className: "bg-gray-500 text-white" },
			danger: { className: "bg-red-500 text-white" },
		},
		size: {
			sm: { className: "px-2 py-1 text-sm" },
			md: { className: "px-4 py-2 text-base" },
			lg: { className: "px-6 py-3 text-lg" },
		},
		disabled: {
			true: { className: "opacity-50 cursor-not-allowed" },
			false: { className: "opacity-100 cursor-pointer" },
		},
	};

	const compounds = [
		{ variant: "primary", disabled: true, props: { className: "bg-blue-300" } },
		{ variant: "danger", disabled: true, props: { className: "bg-red-300" } },
		{ variant: "primary", size: "lg", props: { className: "shadow-lg" } },
	];

	const directProps = { className: "custom-class", "data-testid": "btn" };

	bench("simple: base + 1 variant + direct", () => {
		const variantProps = resolveVariantProps(variants, { variant: "primary" });
		mergeFinalProps(base, variantProps, directProps);
	}).baseline();

	bench("medium: base + 3 variants + compounds + direct", () => {
		const activeVariants = { variant: "primary", size: "lg", disabled: true };
		const variantProps = resolveVariantProps(variants, activeVariants);
		const compoundProps = resolveCompoundVariantProps(
			compounds,
			activeVariants,
		);
		mergeFinalProps(base, variantProps, compoundProps, directProps);
	});

	bench("complex: full flow with tailwind conflicts", () => {
		const activeVariants = { variant: "danger", size: "lg", disabled: true };
		const variantProps = resolveVariantProps(variants, activeVariants);
		const compoundProps = resolveCompoundVariantProps(
			compounds,
			activeVariants,
		);
		const userProps = {
			className: "bg-green-500 px-8",
			style: { fontWeight: "bold" },
			onClick: () => {},
		};
		mergeFinalProps(base, variantProps, compoundProps, userProps);
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
