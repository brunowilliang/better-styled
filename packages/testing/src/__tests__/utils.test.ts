import { describe, expect, it } from "bun:test";
import {
	mergeFinalProps,
	mergeStyles,
	resolveCompoundVariantProps,
	resolveVariantProps,
} from "better-styled";

// =============================================================================
// mergeStyles
// =============================================================================

describe("mergeStyles", () => {
	it("should merge multiple style objects", () => {
		const result = mergeStyles(
			{ padding: 10, color: "red" },
			{ padding: 20, margin: 5 },
		);

		expect(result).toEqual({
			padding: 20,
			color: "red",
			margin: 5,
		});
	});

	it("should handle undefined values", () => {
		const result = mergeStyles(
			{ padding: 10 },
			undefined,
			{ margin: 5 },
			undefined,
		);

		expect(result).toEqual({
			padding: 10,
			margin: 5,
		});
	});

	it("should return undefined for empty input", () => {
		expect(mergeStyles()).toBeUndefined();
		expect(mergeStyles(undefined, undefined)).toBeUndefined();
	});

	it("should return undefined for empty objects", () => {
		expect(mergeStyles({})).toBeUndefined();
		expect(mergeStyles({}, {})).toBeUndefined();
	});

	it("should handle single style object", () => {
		const result = mergeStyles({ padding: 10 });
		expect(result).toEqual({ padding: 10 });
	});

	it("should give priority to later values (last wins)", () => {
		const result = mergeStyles(
			{ padding: 10, margin: 10, color: "red" },
			{ padding: 20 },
			{ padding: 30, margin: 15 },
		);

		expect(result).toEqual({
			padding: 30,
			margin: 15,
			color: "red",
		});
	});
});

// =============================================================================
// mergeFinalProps
// =============================================================================

describe("mergeFinalProps", () => {
	describe("className merging", () => {
		it("should merge classNames from multiple sources", () => {
			const result = mergeFinalProps(
				{ className: "base" },
				{ className: "variant" },
				{ className: "direct" },
			);

			expect(result.className).toBe("base variant direct");
		});

		it("should handle undefined and empty classNames", () => {
			const result = mergeFinalProps(
				{ className: "base" },
				{ className: undefined },
				{ className: "" },
				{ className: "final" },
			);

			expect(result.className).toBe("base final");
		});

		it("should resolve tailwind conflicts (last wins)", () => {
			const result = mergeFinalProps(
				{ className: "p-4 text-sm" },
				{ className: "p-8" },
				{ className: "p-12" },
			);

			// tailwind-merge should keep only p-12
			expect(result.className).toContain("p-12");
			expect(result.className).not.toContain("p-4");
			expect(result.className).not.toContain("p-8");
			expect(result.className).toContain("text-sm");
		});

		it("should handle complex tailwind conflicts", () => {
			const result = mergeFinalProps(
				{ className: "bg-blue-500 text-white px-4 py-2" },
				{ className: "bg-red-500 px-8" },
				{ className: "py-4" },
			);

			expect(result.className).toContain("bg-red-500");
			expect(result.className).not.toContain("bg-blue-500");
			expect(result.className).toContain("text-white");
			expect(result.className).toContain("px-8");
			expect(result.className).not.toContain("px-4");
			expect(result.className).toContain("py-4");
			expect(result.className).not.toContain("py-2");
		});
	});

	describe("style merging", () => {
		it("should merge style objects (last wins for conflicts)", () => {
			const result = mergeFinalProps(
				{ style: { padding: 10, color: "red" } },
				{ style: { padding: 20, margin: 5 } },
				{ style: { padding: 30 } },
			);

			expect(result.style).toEqual({
				padding: 30,
				color: "red",
				margin: 5,
			});
		});

		it("should handle undefined styles", () => {
			const result = mergeFinalProps(
				{ style: { padding: 10 } },
				{ style: undefined },
				{ style: { margin: 5 } },
			);

			expect(result.style).toEqual({
				padding: 10,
				margin: 5,
			});
		});

		it("should not include style if all are undefined", () => {
			const result = mergeFinalProps(
				{ className: "test" },
				{ style: undefined },
			);

			expect(result.style).toBeUndefined();
		});
	});

	describe("function composition", () => {
		it("should compose onClick handlers in order", () => {
			const callOrder: string[] = [];

			const result = mergeFinalProps(
				{ onClick: () => callOrder.push("base") },
				{ onClick: () => callOrder.push("variant") },
				{ onClick: () => callOrder.push("direct") },
			);

			(result.onClick as () => void)();

			expect(callOrder).toEqual(["base", "variant", "direct"]);
		});

		it("should compose multiple different handlers", () => {
			const clicks: string[] = [];
			const hovers: string[] = [];

			const result = mergeFinalProps(
				{
					onClick: () => clicks.push("base"),
					onMouseEnter: () => hovers.push("base"),
				},
				{
					onClick: () => clicks.push("variant"),
					onMouseEnter: () => hovers.push("variant"),
				},
			);

			(result.onClick as () => void)();
			(result.onMouseEnter as () => void)();

			expect(clicks).toEqual(["base", "variant"]);
			expect(hovers).toEqual(["base", "variant"]);
		});

		it("should handle single function (no composition needed)", () => {
			const calls: string[] = [];

			const result = mergeFinalProps(
				{ onClick: () => calls.push("only") },
				{ className: "test" },
			);

			(result.onClick as () => void)();

			expect(calls).toEqual(["only"]);
		});

		it("should skip undefined functions in composition", () => {
			const calls: string[] = [];

			const result = mergeFinalProps(
				{ onClick: () => calls.push("first") },
				{ onClick: undefined },
				{ onClick: () => calls.push("last") },
			);

			(result.onClick as () => void)();

			expect(calls).toEqual(["first", "last"]);
		});

		it("should return result of last function", () => {
			const result = mergeFinalProps(
				{ onClick: () => "first" },
				{ onClick: () => "second" },
				{ onClick: () => "last" },
			);

			const returnValue = (result.onClick as () => string)();

			expect(returnValue).toBe("last");
		});
	});

	describe("simple props merging", () => {
		it("should override simple props (last wins)", () => {
			const result = mergeFinalProps(
				{ disabled: false, title: "base" },
				{ disabled: true },
				{ title: "final" },
			);

			expect(result.disabled).toBe(true);
			expect(result.title).toBe("final");
		});

		it("should handle undefined simple props", () => {
			const result = mergeFinalProps(
				{ title: "base" },
				{ title: undefined },
				{ "data-id": "123" },
			);

			expect(result.title).toBe("base");
			expect(result["data-id"]).toBe("123");
		});

		it("should handle all props combined", () => {
			const calls: string[] = [];

			const result = mergeFinalProps(
				{
					className: "base",
					style: { padding: 10 },
					onClick: () => calls.push("base"),
					disabled: false,
				},
				{
					className: "variant",
					style: { margin: 5 },
					onClick: () => calls.push("variant"),
				},
				{
					className: "direct",
					style: { padding: 20 },
					onClick: () => calls.push("direct"),
					disabled: true,
				},
			);

			(result.onClick as () => void)();

			expect(result.className).toBe("base variant direct");
			expect(result.style).toEqual({ padding: 20, margin: 5 });
			expect(calls).toEqual(["base", "variant", "direct"]);
			expect(result.disabled).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should handle empty sources", () => {
			const result = mergeFinalProps({}, {}, {});
			expect(result).toEqual({});
		});

		it("should handle undefined sources", () => {
			const result = mergeFinalProps(
				undefined,
				{ className: "test" },
				undefined,
			);

			expect(result.className).toBe("test");
		});

		it("should handle no sources", () => {
			const result = mergeFinalProps();
			expect(result).toEqual({});
		});
	});
});

// =============================================================================
// resolveVariantProps
// =============================================================================

describe("resolveVariantProps", () => {
	describe("string variants", () => {
		it("should resolve single string variant", () => {
			const variants = {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
				},
			};

			const result = resolveVariantProps(variants, { variant: "primary" });

			expect(result).toEqual({ className: "btn-primary" });
		});

		it("should resolve multiple string variants", () => {
			const variants = {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
				},
			};

			const result = resolveVariantProps(variants, {
				variant: "primary",
				size: "lg",
			});

			expect(result.className).toContain("btn-primary");
			expect(result.className).toContain("btn-lg");
		});

		it("should ignore unknown variant values", () => {
			const variants = {
				variant: {
					primary: { className: "btn-primary" },
				},
			};

			const result = resolveVariantProps(variants, { variant: "unknown" });

			expect(result).toEqual({});
		});

		it("should ignore unknown variant keys", () => {
			const variants = {
				variant: {
					primary: { className: "btn-primary" },
				},
			};

			const result = resolveVariantProps(variants, {
				unknown: "value",
			} as Record<string, string>);

			expect(result).toEqual({});
		});
	});

	describe("boolean variants", () => {
		it("should resolve boolean true variant", () => {
			const variants = {
				disabled: {
					true: { className: "btn-disabled", disabled: true },
					false: { className: "btn-enabled", disabled: false },
				},
			};

			const result = resolveVariantProps(variants, { disabled: true });

			expect(result).toEqual({ className: "btn-disabled", disabled: true });
		});

		it("should resolve boolean false variant", () => {
			const variants = {
				disabled: {
					true: { className: "btn-disabled" },
					false: { className: "btn-enabled" },
				},
			};

			const result = resolveVariantProps(variants, { disabled: false });

			expect(result).toEqual({ className: "btn-enabled" });
		});

		it("should handle mixed boolean and string variants", () => {
			const variants = {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
				},
				disabled: {
					true: { className: "opacity-50" },
					false: { className: "opacity-100" },
				},
			};

			const result = resolveVariantProps(variants, {
				variant: "primary",
				disabled: true,
			});

			expect(result.className).toContain("btn-primary");
			expect(result.className).toContain("opacity-50");
		});

		it("should handle boolean variant with only true defined", () => {
			const variants = {
				loading: {
					true: { className: "is-loading" },
				},
			};

			const resultTrue = resolveVariantProps(variants, { loading: true });
			expect(resultTrue).toEqual({ className: "is-loading" });

			const resultFalse = resolveVariantProps(variants, { loading: false });
			expect(resultFalse).toEqual({});
		});
	});

	describe("variant props resolution", () => {
		it("should merge className from multiple variants", () => {
			const variants = {
				v1: { a: { className: "class-v1-a" } },
				v2: { b: { className: "class-v2-b" } },
				v3: { c: { className: "class-v3-c" } },
			};

			const result = resolveVariantProps(variants, {
				v1: "a",
				v2: "b",
				v3: "c",
			});

			expect(result.className).toContain("class-v1-a");
			expect(result.className).toContain("class-v2-b");
			expect(result.className).toContain("class-v3-c");
		});

		it("should merge style from multiple variants", () => {
			const variants = {
				size: {
					sm: { style: { padding: 4 } },
					lg: { style: { padding: 16 } },
				},
				color: {
					red: { style: { color: "red" } },
					blue: { style: { color: "blue" } },
				},
			};

			const result = resolveVariantProps(variants, {
				size: "lg",
				color: "blue",
			});

			expect(result.style).toEqual({ padding: 16, color: "blue" });
		});

		it("should resolve tailwind conflicts between variants", () => {
			const variants = {
				base: {
					default: { className: "p-4 m-4" },
				},
				size: {
					lg: { className: "p-8" },
				},
			};

			const result = resolveVariantProps(variants, {
				base: "default",
				size: "lg",
			});

			expect(result.className).toContain("p-8");
			expect(result.className).not.toContain("p-4");
			expect(result.className).toContain("m-4");
		});
	});

	describe("edge cases", () => {
		it("should return empty object for undefined variants", () => {
			const result = resolveVariantProps(undefined, { variant: "primary" });
			expect(result).toEqual({});
		});

		it("should return empty object for empty active variants", () => {
			const variants = {
				variant: { primary: { className: "btn-primary" } },
			};

			const result = resolveVariantProps(variants, {});
			expect(result).toEqual({});
		});

		it("should handle variants with non-className props", () => {
			const variants = {
				type: {
					submit: { type: "submit" as const },
					button: { type: "button" as const },
				},
			};

			const result = resolveVariantProps(variants, { type: "submit" });
			expect(result).toEqual({ type: "submit" });
		});
	});
});

// =============================================================================
// resolveCompoundVariantProps
// =============================================================================

describe("resolveCompoundVariantProps", () => {
	describe("basic matching", () => {
		it("should apply compound when all conditions match", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					props: { className: "compound-primary-lg" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
			});

			expect(result).toEqual({ className: "compound-primary-lg" });
		});

		it("should NOT apply compound when conditions partially match", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					props: { className: "compound-primary-lg" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "sm",
			});

			expect(result).toEqual({});
		});

		it("should NOT apply compound when one condition is missing", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					props: { className: "compound-primary-lg" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
			});

			expect(result).toEqual({});
		});
	});

	describe("multiple compounds", () => {
		it("should apply multiple matching compounds", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					props: { className: "compound-1" },
				},
				{
					variant: "primary",
					disabled: true,
					props: { className: "compound-2" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
				disabled: true,
			});

			expect(result.className).toContain("compound-1");
			expect(result.className).toContain("compound-2");
		});

		it("should only apply compounds that fully match", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					props: { className: "compound-1" },
				},
				{
					variant: "primary",
					size: "sm",
					props: { className: "compound-2" },
				},
				{
					variant: "secondary",
					size: "lg",
					props: { className: "compound-3" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
			});

			expect(result.className).toContain("compound-1");
			expect(result.className).not.toContain("compound-2");
			expect(result.className).not.toContain("compound-3");
		});
	});

	describe("boolean conditions", () => {
		it("should match boolean true condition", () => {
			const compounds = [
				{
					disabled: true,
					props: { className: "is-disabled" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				disabled: true,
			});

			expect(result).toEqual({ className: "is-disabled" });
		});

		it("should match boolean false condition", () => {
			const compounds = [
				{
					disabled: false,
					props: { className: "is-enabled" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				disabled: false,
			});

			expect(result).toEqual({ className: "is-enabled" });
		});

		it("should handle mixed boolean and string conditions", () => {
			const compounds = [
				{
					variant: "danger",
					disabled: true,
					props: { className: "danger-disabled" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "danger",
				disabled: true,
			});

			expect(result).toEqual({ className: "danger-disabled" });
		});
	});

	describe("3+ conditions", () => {
		it("should match compound with 3 conditions", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					disabled: true,
					props: { className: "triple-match" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
				disabled: true,
			});

			expect(result).toEqual({ className: "triple-match" });
		});

		it("should NOT match compound with 3 conditions when one differs", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					disabled: true,
					props: { className: "triple-match" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
				disabled: false,
			});

			expect(result).toEqual({});
		});

		it("should match compound with 4+ conditions", () => {
			const compounds = [
				{
					variant: "primary",
					size: "lg",
					disabled: false,
					loading: true,
					props: { className: "quad-match" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
				disabled: false,
				loading: true,
			});

			expect(result).toEqual({ className: "quad-match" });
		});
	});

	describe("props merging", () => {
		it("should merge style from multiple matching compounds", () => {
			const compounds = [
				{
					variant: "primary",
					props: { style: { padding: 10 } },
				},
				{
					size: "lg",
					props: { style: { margin: 20 } },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
			});

			expect(result.style).toEqual({ padding: 10, margin: 20 });
		});

		it("should merge non-className props", () => {
			const compounds = [
				{
					variant: "danger",
					props: { "aria-label": "Danger action", role: "alert" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "danger",
			});

			expect(result).toEqual({ "aria-label": "Danger action", role: "alert" });
		});
	});

	describe("edge cases", () => {
		it("should return empty object for undefined compounds", () => {
			const result = resolveCompoundVariantProps(undefined, {
				variant: "primary",
			});
			expect(result).toEqual({});
		});

		it("should return empty object for empty compounds array", () => {
			const result = resolveCompoundVariantProps([], { variant: "primary" });
			expect(result).toEqual({});
		});

		it("should return empty object when no compounds match", () => {
			const compounds = [
				{
					variant: "secondary",
					props: { className: "secondary-class" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
			});

			expect(result).toEqual({});
		});

		it("should handle compound with single condition", () => {
			const compounds = [
				{
					disabled: true,
					props: { className: "just-disabled" },
				},
			];

			const result = resolveCompoundVariantProps(compounds, {
				variant: "primary",
				size: "lg",
				disabled: true,
			});

			expect(result).toEqual({ className: "just-disabled" });
		});
	});
});

// =============================================================================
// Integration: Full Resolution Flow
// =============================================================================

describe("Integration: Full Props Resolution", () => {
	it("should simulate complete styled() resolution flow", () => {
		// Setup
		const base = { className: "btn font-medium" };

		const variants = {
			variant: {
				primary: { className: "bg-blue-500 text-white" },
				danger: { className: "bg-red-500 text-white" },
			},
			size: {
				sm: { className: "px-2 py-1 text-sm" },
				lg: { className: "px-4 py-2 text-lg" },
			},
			disabled: {
				true: { className: "opacity-50 cursor-not-allowed" },
				false: { className: "opacity-100 cursor-pointer" },
			},
		};

		const compounds = [
			{
				variant: "danger",
				disabled: true,
				props: { className: "bg-red-300" },
			},
		];

		const directProps = {
			className: "custom-class",
			onClick: () => "clicked",
		};

		// Active variants
		const activeVariants = {
			variant: "danger",
			size: "lg",
			disabled: true,
		};

		// Resolution flow (same as styled.tsx)
		const variantProps = resolveVariantProps(variants, activeVariants);
		const compoundProps = resolveCompoundVariantProps(compounds, activeVariants);
		const finalProps = mergeFinalProps(
			base,
			variantProps,
			compoundProps,
			directProps,
		);

		// Assertions
		expect(finalProps.className).toContain("btn");
		expect(finalProps.className).toContain("font-medium");
		expect(finalProps.className).toContain("bg-red-300"); // compound overrides variant
		expect(finalProps.className).not.toContain("bg-red-500"); // tailwind-merge removes conflict
		expect(finalProps.className).toContain("text-white");
		expect(finalProps.className).toContain("px-4");
		expect(finalProps.className).toContain("py-2");
		expect(finalProps.className).toContain("text-lg");
		expect(finalProps.className).toContain("opacity-50");
		expect(finalProps.className).toContain("cursor-not-allowed");
		expect(finalProps.className).toContain("custom-class");
		expect((finalProps.onClick as () => string)()).toBe("clicked");
	});

	it("should handle resolution with defaults and overrides", () => {
		const base = { className: "base" };

		const variants = {
			variant: {
				primary: { className: "variant-primary" },
				secondary: { className: "variant-secondary" },
			},
		};

		const defaultVariants = { variant: "primary" };

		// User overrides default
		const activeVariants = { variant: "secondary" };

		const variantProps = resolveVariantProps(variants, {
			...defaultVariants,
			...activeVariants,
		});
		const finalProps = mergeFinalProps(base, variantProps);

		expect(finalProps.className).toContain("base");
		expect(finalProps.className).toContain("variant-secondary");
		expect(finalProps.className).not.toContain("variant-primary");
	});
});
