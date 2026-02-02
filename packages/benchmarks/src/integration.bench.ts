/**
 * Integration Benchmarks
 *
 * Tests real-world scenarios combining:
 * - styled() with variants and compounds
 * - createStyledContext() for variant propagation
 * - withSlots() for compound components
 */

import { createStyledContext, styled, withSlots } from "better-styled";
import { bench, group, run } from "mitata";
import { createElement } from "react";

// =============================================================================
// Real-World Component: Button with Icon
// =============================================================================

const ButtonContext = createStyledContext({
	variant: ["primary", "secondary", "outline", "ghost", "danger"],
	size: ["xs", "sm", "md", "lg", "xl"],
	disabled: ["boolean"],
	loading: ["boolean"],
});

const ButtonBase = styled("button", {
	context: ButtonContext,
	base: {
		className: "btn inline-flex items-center justify-center font-medium",
	},
	variants: {
		variant: {
			primary: { className: "bg-blue-500 text-white hover:bg-blue-600" },
			secondary: { className: "bg-gray-500 text-white hover:bg-gray-600" },
			outline: { className: "border-2 border-current bg-transparent" },
			ghost: { className: "bg-transparent hover:bg-gray-100" },
			danger: { className: "bg-red-500 text-white hover:bg-red-600" },
		},
		size: {
			xs: { className: "text-xs px-2 py-1 gap-1" },
			sm: { className: "text-sm px-3 py-1.5 gap-1.5" },
			md: { className: "text-base px-4 py-2 gap-2" },
			lg: { className: "text-lg px-5 py-2.5 gap-2.5" },
			xl: { className: "text-xl px-6 py-3 gap-3" },
		},
		disabled: {
			true: { className: "opacity-50 cursor-not-allowed" },
			false: { className: "" },
		},
		loading: {
			true: { className: "cursor-wait" },
			false: { className: "" },
		},
	},
	compoundVariants: [
		{
			variant: "primary",
			disabled: true,
			props: { className: "bg-blue-300 hover:bg-blue-300" },
		},
		{
			variant: "secondary",
			disabled: true,
			props: { className: "bg-gray-300 hover:bg-gray-300" },
		},
		{
			variant: "danger",
			disabled: true,
			props: { className: "bg-red-300 hover:bg-red-300" },
		},
		{ variant: "primary", loading: true, props: { className: "bg-blue-400" } },
		{
			variant: "outline",
			disabled: true,
			props: { className: "border-gray-300 text-gray-300" },
		},
	],
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		loading: false,
	},
});

const ButtonIcon = styled("span", {
	context: ButtonContext,
	base: { className: "inline-flex shrink-0" },
	variants: {
		size: {
			xs: { className: "w-3 h-3" },
			sm: { className: "w-4 h-4" },
			md: { className: "w-5 h-5" },
			lg: { className: "w-6 h-6" },
			xl: { className: "w-7 h-7" },
		},
		loading: {
			true: { className: "animate-spin" },
			false: { className: "" },
		},
	},
	defaultVariants: {
		size: "md",
		loading: false,
	},
});

const ButtonLabel = styled("span", {
	context: ButtonContext,
	base: { className: "truncate" },
	variants: {
		loading: {
			true: { className: "opacity-70" },
			false: { className: "" },
		},
	},
	defaultVariants: {
		loading: false,
	},
});

const Button = withSlots(ButtonBase, {
	Icon: ButtonIcon,
	Label: ButtonLabel,
});

// =============================================================================
// Real-World Component: Card
// =============================================================================

const CardContext = createStyledContext({
	variant: ["default", "bordered", "elevated", "filled"],
	size: ["sm", "md", "lg"],
	interactive: ["boolean"],
});

const CardBase = styled("div", {
	context: CardContext,
	base: { className: "card rounded-lg" },
	variants: {
		variant: {
			default: { className: "bg-white" },
			bordered: { className: "bg-white border border-gray-200" },
			elevated: { className: "bg-white shadow-lg" },
			filled: { className: "bg-gray-100" },
		},
		size: {
			sm: { className: "p-3" },
			md: { className: "p-4" },
			lg: { className: "p-6" },
		},
		interactive: {
			true: { className: "cursor-pointer hover:shadow-md transition-shadow" },
			false: { className: "" },
		},
	},
	compoundVariants: [
		{
			variant: "elevated",
			interactive: true,
			props: { className: "hover:shadow-xl" },
		},
		{
			variant: "bordered",
			interactive: true,
			props: { className: "hover:border-gray-300" },
		},
	],
	defaultVariants: {
		variant: "default",
		size: "md",
		interactive: false,
	},
});

const CardHeader = styled("header", {
	context: CardContext,
	base: { className: "card-header" },
	variants: {
		size: {
			sm: { className: "mb-2" },
			md: { className: "mb-3" },
			lg: { className: "mb-4" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const CardTitle = styled("h3", {
	context: CardContext,
	base: { className: "card-title font-semibold" },
	variants: {
		size: {
			sm: { className: "text-sm" },
			md: { className: "text-base" },
			lg: { className: "text-lg" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const CardBody = styled("div", {
	context: CardContext,
	base: { className: "card-body" },
	variants: {
		size: {
			sm: { className: "text-sm" },
			md: { className: "text-base" },
			lg: { className: "text-lg" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const CardFooter = styled("footer", {
	context: CardContext,
	base: { className: "card-footer" },
	variants: {
		size: {
			sm: { className: "mt-2 pt-2 border-t" },
			md: { className: "mt-3 pt-3 border-t" },
			lg: { className: "mt-4 pt-4 border-t" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const HeaderWithTitle = withSlots(CardHeader, {
	Title: CardTitle,
});

const Card = withSlots(CardBase, {
	Header: HeaderWithTitle,
	Body: CardBody,
	Footer: CardFooter,
});

// =============================================================================
// Real-World Component: Form Input
// =============================================================================

const InputContext = createStyledContext({
	size: ["sm", "md", "lg"],
	variant: ["outline", "filled", "flushed"],
	state: ["default", "error", "success"],
	disabled: ["boolean"],
});

const InputWrapper = styled("div", {
	context: InputContext,
	base: { className: "input-wrapper flex flex-col" },
	variants: {
		size: {
			sm: { className: "gap-1" },
			md: { className: "gap-1.5" },
			lg: { className: "gap-2" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const InputLabel = styled("label", {
	context: InputContext,
	base: { className: "input-label font-medium" },
	variants: {
		size: {
			sm: { className: "text-xs" },
			md: { className: "text-sm" },
			lg: { className: "text-base" },
		},
		state: {
			default: { className: "text-gray-700" },
			error: { className: "text-red-600" },
			success: { className: "text-green-600" },
		},
		disabled: {
			true: { className: "text-gray-400" },
			false: { className: "" },
		},
	},
	defaultVariants: {
		size: "md",
		state: "default",
		disabled: false,
	},
});

const InputField = styled("input", {
	context: InputContext,
	base: { className: "input-field w-full transition-colors" },
	variants: {
		size: {
			sm: { className: "text-sm px-2 py-1" },
			md: { className: "text-base px-3 py-2" },
			lg: { className: "text-lg px-4 py-3" },
		},
		variant: {
			outline: { className: "border rounded-md bg-white" },
			filled: { className: "border-0 rounded-md bg-gray-100" },
			flushed: { className: "border-0 border-b-2 rounded-none bg-transparent" },
		},
		state: {
			default: { className: "border-gray-300 focus:border-blue-500" },
			error: { className: "border-red-500 focus:border-red-600" },
			success: { className: "border-green-500 focus:border-green-600" },
		},
		disabled: {
			true: { className: "bg-gray-50 text-gray-400 cursor-not-allowed" },
			false: { className: "" },
		},
	},
	compoundVariants: [
		{ variant: "filled", state: "error", props: { className: "bg-red-50" } },
		{
			variant: "filled",
			state: "success",
			props: { className: "bg-green-50" },
		},
		{ variant: "filled", disabled: true, props: { className: "bg-gray-200" } },
	],
	defaultVariants: {
		size: "md",
		variant: "outline",
		state: "default",
		disabled: false,
	},
});

const InputHelperText = styled("span", {
	context: InputContext,
	base: { className: "input-helper" },
	variants: {
		size: {
			sm: { className: "text-xs" },
			md: { className: "text-sm" },
			lg: { className: "text-base" },
		},
		state: {
			default: { className: "text-gray-500" },
			error: { className: "text-red-600" },
			success: { className: "text-green-600" },
		},
	},
	defaultVariants: {
		size: "md",
		state: "default",
	},
});

const Input = withSlots(InputWrapper, {
	Label: InputLabel,
	Field: InputField,
	HelperText: InputHelperText,
});

// =============================================================================
// Benchmarks: Real-World Button
// =============================================================================

group("Integration: Button Component", () => {
	bench("createElement Button only", () => {
		createElement(Button, { children: "Click me" });
	}).baseline();

	bench("Button with variant props", () => {
		createElement(Button, {
			variant: "secondary",
			size: "lg",
			children: "Click me",
		});
	});

	bench("Button disabled state", () => {
		createElement(Button, {
			variant: "primary",
			disabled: true,
			children: "Click me",
		});
	});

	bench("Button with Icon slot", () => {
		createElement(
			Button,
			{ variant: "primary", size: "md" },
			createElement(Button.Icon, null, "→"),
			createElement(Button.Label, null, "Next"),
		);
	});

	bench("Button loading state with Icon", () => {
		createElement(
			Button,
			{ variant: "primary", loading: true },
			createElement(Button.Icon, null, "⟳"),
			createElement(Button.Label, null, "Loading..."),
		);
	});
});

// =============================================================================
// Benchmarks: Real-World Card
// =============================================================================

group("Integration: Card Component", () => {
	bench("createElement Card only", () => {
		createElement(Card, { children: "Content" });
	}).baseline();

	bench("Card with variant props", () => {
		createElement(Card, {
			variant: "elevated",
			size: "lg",
			children: "Content",
		});
	});

	bench("Card interactive", () => {
		createElement(Card, {
			variant: "bordered",
			interactive: true,
			children: "Content",
		});
	});

	bench("Card with Header + Body", () => {
		createElement(
			Card,
			{ variant: "bordered" },
			createElement(
				Card.Header,
				null,
				createElement(Card.Header.Title, null, "Title"),
			),
			createElement(Card.Body, null, "Body content"),
		);
	});

	bench("Card full structure", () => {
		createElement(
			Card,
			{ variant: "elevated", size: "lg" },
			createElement(
				Card.Header,
				null,
				createElement(Card.Header.Title, null, "Card Title"),
			),
			createElement(
				Card.Body,
				null,
				"This is the card body with some content.",
			),
			createElement(Card.Footer, null, "Footer actions here"),
		);
	});
});

// =============================================================================
// Benchmarks: Real-World Form Input
// =============================================================================

group("Integration: Input Component", () => {
	bench("createElement Input only", () => {
		createElement(Input, { children: null });
	}).baseline();

	bench("Input with variant props", () => {
		createElement(Input, {
			size: "lg",
			variant: "filled",
			children: null,
		});
	});

	bench("Input error state", () => {
		createElement(Input, {
			state: "error",
			children: null,
		});
	});

	bench("Input with Label + Field", () => {
		createElement(
			Input,
			{ size: "md", variant: "outline" },
			createElement(Input.Label, null, "Email"),
			createElement(Input.Field, { type: "email", placeholder: "Enter email" }),
		);
	});

	bench("Input full structure", () => {
		createElement(
			Input,
			{ size: "md", variant: "outline", state: "error" },
			createElement(Input.Label, null, "Email"),
			createElement(Input.Field, { type: "email", placeholder: "Enter email" }),
			createElement(Input.HelperText, null, "Please enter a valid email"),
		);
	});
});

// =============================================================================
// Benchmarks: Component Composition
// =============================================================================

group("Integration: Complex Composition", () => {
	bench("Button alone", () => {
		createElement(Button, { variant: "primary", children: "Submit" });
	}).baseline();

	bench("Card with Button in Footer", () => {
		createElement(
			Card,
			{ variant: "bordered" },
			createElement(
				Card.Header,
				null,
				createElement(Card.Header.Title, null, "Confirm"),
			),
			createElement(Card.Body, null, "Are you sure?"),
			createElement(
				Card.Footer,
				null,
				createElement(Button, { variant: "ghost", size: "sm" }, "Cancel"),
				createElement(Button, { variant: "primary", size: "sm" }, "Confirm"),
			),
		);
	});

	bench("Form with multiple Inputs", () => {
		createElement(
			"form",
			{ className: "space-y-4" },
			createElement(
				Input,
				{ size: "md" },
				createElement(Input.Label, null, "Name"),
				createElement(Input.Field, { type: "text" }),
			),
			createElement(
				Input,
				{ size: "md" },
				createElement(Input.Label, null, "Email"),
				createElement(Input.Field, { type: "email" }),
			),
			createElement(
				Input,
				{ size: "md" },
				createElement(Input.Label, null, "Password"),
				createElement(Input.Field, { type: "password" }),
			),
		);
	});

	bench("Full page section", () => {
		createElement(
			"section",
			{ className: "p-8" },
			createElement(
				Card,
				{ variant: "elevated", size: "lg" },
				createElement(
					Card.Header,
					null,
					createElement(Card.Header.Title, null, "Login"),
				),
				createElement(
					Card.Body,
					null,
					createElement(
						"form",
						{ className: "space-y-4" },
						createElement(
							Input,
							{ size: "md" },
							createElement(Input.Label, null, "Email"),
							createElement(Input.Field, { type: "email" }),
						),
						createElement(
							Input,
							{ size: "md" },
							createElement(Input.Label, null, "Password"),
							createElement(Input.Field, { type: "password" }),
						),
					),
				),
				createElement(
					Card.Footer,
					null,
					createElement(
						Button,
						{ variant: "primary", size: "lg" },
						createElement(Button.Label, null, "Sign In"),
					),
				),
			),
		);
	});
});

// =============================================================================
// Benchmarks: Variant Propagation
// =============================================================================

group("Integration: Context Propagation Depth", () => {
	bench("1 level (Button only)", () => {
		createElement(Button, { variant: "primary", size: "lg" }, "Click");
	}).baseline();

	bench("2 levels (Button + Icon)", () => {
		createElement(
			Button,
			{ variant: "primary", size: "lg" },
			createElement(Button.Icon, null, "→"),
		);
	});

	bench("3 levels (Card + Header + Title)", () => {
		createElement(
			Card,
			{ variant: "elevated", size: "lg" },
			createElement(
				Card.Header,
				null,
				createElement(Card.Header.Title, null, "Title"),
			),
		);
	});

	bench("4 levels (Input + all slots)", () => {
		createElement(
			Input,
			{ size: "lg", variant: "filled", state: "error" },
			createElement(Input.Label, null, "Label"),
			createElement(Input.Field, { type: "text" }),
			createElement(Input.HelperText, null, "Helper"),
		);
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
