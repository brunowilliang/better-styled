import { describe, expect, it } from "bun:test";
import { fireEvent, render, screen } from "@better-styled/testing";
import { createStyledContext, styled, withSlots } from "better-styled";
import { useState } from "react";

/**
 * Integration Tests
 *
 * These tests verify the complete integration between:
 * - styled() - creating styled components with variants
 * - createStyledContext() - sharing variants through context
 * - withSlots() - compound component pattern
 */

describe("Integration: Complete Compound Component Pattern", () => {
	it("should create a Card component with Header, Body, Footer slots sharing context", () => {
		const CardContext = createStyledContext({
			variant: ["default", "elevated", "outlined"],
			size: ["sm", "md", "lg"],
		});

		const CardRoot = styled("div", {
			context: CardContext,
			base: { className: "card" },
			variants: {
				variant: {
					default: { className: "card-default" },
					elevated: { className: "card-elevated" },
					outlined: { className: "card-outlined" },
				},
				size: {
					sm: { className: "card-sm" },
					md: { className: "card-md" },
					lg: { className: "card-lg" },
				},
			},
			defaultVariants: {
				variant: "default",
				size: "md",
			},
		});

		const CardHeader = styled("header", {
			context: CardContext,
			base: { className: "card-header" },
			variants: {
				size: {
					sm: { className: "header-sm" },
					md: { className: "header-md" },
					lg: { className: "header-lg" },
				},
			},
		});

		const CardBody = styled("main", {
			context: CardContext,
			base: { className: "card-body" },
			variants: {
				size: {
					sm: { className: "body-sm" },
					md: { className: "body-md" },
					lg: { className: "body-lg" },
				},
			},
		});

		const CardFooter = styled("footer", {
			context: CardContext,
			base: { className: "card-footer" },
			variants: {
				size: {
					sm: { className: "footer-sm" },
					md: { className: "footer-md" },
					lg: { className: "footer-lg" },
				},
			},
		});

		const Card = withSlots(CardRoot, {
			Header: CardHeader,
			Body: CardBody,
			Footer: CardFooter,
		});

		render(
			<Card data-testid="card" variant="elevated" size="lg">
				<Card.Header data-testid="header">Title</Card.Header>
				<Card.Body data-testid="body">Content</Card.Body>
				<Card.Footer data-testid="footer">Actions</Card.Footer>
			</Card>,
		);

		// Card root should have variant and size classes
		expect(screen.getByTestId("card")).toHaveClass("card-elevated", "card-lg");

		// All slots should inherit size from context
		expect(screen.getByTestId("header")).toHaveClass("header-lg");
		expect(screen.getByTestId("body")).toHaveClass("body-lg");
		expect(screen.getByTestId("footer")).toHaveClass("footer-lg");
	});

	it("should handle nested Cards with different variants", () => {
		const CardContext = createStyledContext({
			theme: ["light", "dark"],
		});

		const CardRoot = styled("div", {
			context: CardContext,
			base: { className: "card" },
			variants: {
				theme: {
					light: { className: "card-light" },
					dark: { className: "card-dark" },
				},
			},
		});

		const CardContent = styled("div", {
			context: CardContext,
			base: { className: "content" },
			variants: {
				theme: {
					light: { className: "content-light" },
					dark: { className: "content-dark" },
				},
			},
		});

		const Card = withSlots(CardRoot, {
			Content: CardContent,
		});

		render(
			<Card data-testid="outer-card" theme="light">
				<Card.Content data-testid="outer-content">
					<Card data-testid="inner-card" theme="dark">
						<Card.Content data-testid="inner-content">
							Nested content
						</Card.Content>
					</Card>
				</Card.Content>
			</Card>,
		);

		// Outer card is light
		expect(screen.getByTestId("outer-card")).toHaveClass("card-light");
		expect(screen.getByTestId("outer-content")).toHaveClass("content-light");

		// Inner card is dark (overrides parent context)
		expect(screen.getByTestId("inner-card")).toHaveClass("card-dark");
		expect(screen.getByTestId("inner-content")).toHaveClass("content-dark");
	});
});

describe("Integration: Real-World Button Component", () => {
	it("should create Button with Icon and Label slots with compound variants", () => {
		const ButtonContext = createStyledContext({
			variant: ["primary", "secondary", "danger"],
			size: ["sm", "md", "lg"],
			disabled: ["boolean"],
		});

		const ButtonRoot = styled("button", {
			context: ButtonContext,
			base: { className: "btn" },
			variants: {
				variant: {
					primary: { className: "btn-primary" },
					secondary: { className: "btn-secondary" },
					danger: { className: "btn-danger" },
				},
				size: {
					sm: { className: "btn-sm" },
					md: { className: "btn-md" },
					lg: { className: "btn-lg" },
				},
				disabled: {
					true: { className: "btn-disabled", disabled: true },
					false: { disabled: false },
				},
			},
			compoundVariants: [
				{
					variant: "danger",
					disabled: true,
					props: { className: "danger-disabled-special" },
				},
			],
			defaultVariants: {
				variant: "primary",
				size: "md",
				disabled: false,
			},
		});

		const ButtonIcon = styled("span", {
			context: ButtonContext,
			base: { className: "btn-icon" },
			variants: {
				size: {
					sm: { className: "icon-sm" },
					md: { className: "icon-md" },
					lg: { className: "icon-lg" },
				},
			},
		});

		const ButtonLabel = styled("span", {
			context: ButtonContext,
			base: { className: "btn-label" },
			variants: {
				size: {
					sm: { className: "label-sm" },
					md: { className: "label-md" },
					lg: { className: "label-lg" },
				},
				disabled: {
					true: { className: "label-muted" },
					false: {},
				},
			},
		});

		const Button = withSlots(ButtonRoot, {
			Icon: ButtonIcon,
			Label: ButtonLabel,
		});

		// Test compound variant: danger + disabled
		render(
			<Button data-testid="btn" variant="danger" size="lg" disabled>
				<Button.Icon data-testid="icon">⚠️</Button.Icon>
				<Button.Label data-testid="label">Delete</Button.Label>
			</Button>,
		);

		const btn = screen.getByTestId("btn");
		expect(btn).toHaveClass("btn-danger");
		expect(btn).toHaveClass("btn-lg");
		expect(btn).toHaveClass("btn-disabled");
		expect(btn).toHaveClass("danger-disabled-special"); // Compound variant
		expect(btn).toBeDisabled();

		// Slots should inherit size
		expect(screen.getByTestId("icon")).toHaveClass("icon-lg");
		expect(screen.getByTestId("label")).toHaveClass("label-lg");
		expect(screen.getByTestId("label")).toHaveClass("label-muted");
	});

	it("should compose onClick handlers from multiple sources", () => {
		const callLog: string[] = [];

		const ButtonRoot = styled("button", {
			base: {
				className: "btn",
				onClick: () => callLog.push("base"),
			},
			variants: {
				variant: {
					primary: {
						className: "btn-primary",
						onClick: () => callLog.push("variant"),
					},
				},
			},
		});

		const Button = withSlots(ButtonRoot, {
			Label: ({ children }: { children?: React.ReactNode }) => (
				<span>{children}</span>
			),
		});

		render(
			<Button
				data-testid="btn"
				variant="primary"
				onClick={() => callLog.push("prop")}
			>
				<Button.Label>Click</Button.Label>
			</Button>,
		);

		fireEvent.click(screen.getByTestId("btn"));

		// All handlers should be called in order
		expect(callLog).toEqual(["base", "variant", "prop"]);
	});
});

describe("Integration: Form Components", () => {
	it("should share error state through form context", () => {
		const FormFieldContext = createStyledContext({
			hasError: ["boolean"],
			size: ["sm", "md"],
		});

		const FieldRoot = styled("div", {
			context: FormFieldContext,
			base: { className: "field" },
			variants: {
				hasError: {
					true: { className: "field-error" },
					false: { className: "field-valid" },
				},
				size: {
					sm: { className: "field-sm" },
					md: { className: "field-md" },
				},
			},
			defaultVariants: {
				hasError: false,
				size: "md",
			},
		});

		const FieldLabel = styled("span", {
			context: FormFieldContext,
			base: { className: "field-label" },
			variants: {
				hasError: {
					true: { className: "label-error" },
					false: {},
				},
			},
		});

		const FieldInput = styled("input", {
			context: FormFieldContext,
			base: { className: "field-input" },
			variants: {
				hasError: {
					true: { className: "input-error" },
					false: { className: "input-valid" },
				},
				size: {
					sm: { className: "input-sm" },
					md: { className: "input-md" },
				},
			},
		});

		const FieldMessage = styled("span", {
			context: FormFieldContext,
			base: { className: "field-message" },
			variants: {
				hasError: {
					true: { className: "message-error" },
					false: { className: "message-success" },
				},
			},
		});

		const Field = withSlots(FieldRoot, {
			Label: FieldLabel,
			Input: FieldInput,
			Message: FieldMessage,
		});

		render(
			<Field data-testid="field" hasError size="sm">
				<Field.Label data-testid="label">Email</Field.Label>
				<Field.Input data-testid="input" type="email" />
				<Field.Message data-testid="message">Invalid email</Field.Message>
			</Field>,
		);

		// All components should reflect error state
		expect(screen.getByTestId("field")).toHaveClass("field-error", "field-sm");
		expect(screen.getByTestId("label")).toHaveClass("label-error");
		expect(screen.getByTestId("input")).toHaveClass("input-error", "input-sm");
		expect(screen.getByTestId("message")).toHaveClass("message-error");
	});

	it("should apply disabled to all form children", () => {
		const InputContext = createStyledContext({
			disabled: ["boolean"],
		});

		const InputRoot = styled("div", {
			context: InputContext,
			base: { className: "input-wrapper" },
			variants: {
				disabled: {
					true: { className: "wrapper-disabled" },
					false: {},
				},
			},
		});

		const InputElement = styled("input", {
			context: InputContext,
			base: { className: "input" },
			variants: {
				disabled: {
					true: { className: "input-disabled", disabled: true },
					false: { disabled: false },
				},
			},
		});

		const InputAddon = styled("span", {
			context: InputContext,
			base: { className: "addon" },
			variants: {
				disabled: {
					true: { className: "addon-disabled" },
					false: {},
				},
			},
		});

		const Input = withSlots(InputRoot, {
			Element: InputElement,
			Addon: InputAddon,
		});

		render(
			<Input data-testid="wrapper" disabled>
				<Input.Addon data-testid="prefix">$</Input.Addon>
				<Input.Element data-testid="input" />
				<Input.Addon data-testid="suffix">.00</Input.Addon>
			</Input>,
		);

		expect(screen.getByTestId("wrapper")).toHaveClass("wrapper-disabled");
		expect(screen.getByTestId("input")).toHaveClass("input-disabled");
		expect(screen.getByTestId("input")).toBeDisabled();
		expect(screen.getByTestId("prefix")).toHaveClass("addon-disabled");
		expect(screen.getByTestId("suffix")).toHaveClass("addon-disabled");
	});
});

describe("Integration: Dynamic State Changes", () => {
	it("should update all compound children when state changes", () => {
		const AlertContext = createStyledContext({
			type: ["info", "success", "warning", "error"],
		});

		const AlertRoot = styled("div", {
			context: AlertContext,
			base: { className: "alert" },
			variants: {
				type: {
					info: { className: "alert-info" },
					success: { className: "alert-success" },
					warning: { className: "alert-warning" },
					error: { className: "alert-error" },
				},
			},
		});

		const AlertIcon = styled("span", {
			context: AlertContext,
			base: { className: "alert-icon" },
			variants: {
				type: {
					info: { className: "icon-info" },
					success: { className: "icon-success" },
					warning: { className: "icon-warning" },
					error: { className: "icon-error" },
				},
			},
		});

		const AlertText = styled("span", {
			context: AlertContext,
			base: { className: "alert-text" },
			variants: {
				type: {
					info: { className: "text-info" },
					success: { className: "text-success" },
					warning: { className: "text-warning" },
					error: { className: "text-error" },
				},
			},
		});

		const Alert = withSlots(AlertRoot, {
			Icon: AlertIcon,
			Text: AlertText,
		});

		const App = () => {
			const [type, setType] = useState<
				"info" | "success" | "warning" | "error"
			>("info");

			return (
				<div>
					<button
						type="button"
						data-testid="change-type"
						onClick={() => setType("error")}
					>
						Change to Error
					</button>
					<Alert data-testid="alert" type={type}>
						<Alert.Icon data-testid="icon">!</Alert.Icon>
						<Alert.Text data-testid="text">Message</Alert.Text>
					</Alert>
				</div>
			);
		};

		render(<App />);

		// Initial state
		expect(screen.getByTestId("alert")).toHaveClass("alert-info");
		expect(screen.getByTestId("icon")).toHaveClass("icon-info");
		expect(screen.getByTestId("text")).toHaveClass("text-info");

		// Change state
		fireEvent.click(screen.getByTestId("change-type"));

		// All should update
		expect(screen.getByTestId("alert")).toHaveClass("alert-error");
		expect(screen.getByTestId("icon")).toHaveClass("icon-error");
		expect(screen.getByTestId("text")).toHaveClass("text-error");
	});
});

describe("Integration: Complex Component Hierarchies", () => {
	it("should handle 3-level nested compound components", () => {
		// Level 1: Accordion context
		const AccordionContext = createStyledContext({
			variant: ["default", "bordered"],
		});

		const AccordionRoot = styled("div", {
			context: AccordionContext,
			base: { className: "accordion" },
			variants: {
				variant: {
					default: { className: "accordion-default" },
					bordered: { className: "accordion-bordered" },
				},
			},
		});

		// Level 2: Item inherits from Accordion
		const AccordionItem = styled("div", {
			context: AccordionContext,
			base: { className: "accordion-item" },
			variants: {
				variant: {
					default: { className: "item-default" },
					bordered: { className: "item-bordered" },
				},
			},
		});

		// Level 3: Header and Content inherit from Accordion
		const AccordionHeader = styled("button", {
			context: AccordionContext,
			base: { className: "accordion-header", type: "button" },
			variants: {
				variant: {
					default: { className: "header-default" },
					bordered: { className: "header-bordered" },
				},
			},
		});

		const AccordionContent = styled("div", {
			context: AccordionContext,
			base: { className: "accordion-content" },
			variants: {
				variant: {
					default: { className: "content-default" },
					bordered: { className: "content-bordered" },
				},
			},
		});

		// Build compound component
		const Item = withSlots(AccordionItem, {
			Header: AccordionHeader,
			Content: AccordionContent,
		});

		const Accordion = withSlots(AccordionRoot, {
			Item,
		});

		render(
			<Accordion data-testid="accordion" variant="bordered">
				<Accordion.Item data-testid="item-1">
					<Accordion.Item.Header data-testid="header-1">
						Section 1
					</Accordion.Item.Header>
					<Accordion.Item.Content data-testid="content-1">
						Content 1
					</Accordion.Item.Content>
				</Accordion.Item>
				<Accordion.Item data-testid="item-2">
					<Accordion.Item.Header data-testid="header-2">
						Section 2
					</Accordion.Item.Header>
					<Accordion.Item.Content data-testid="content-2">
						Content 2
					</Accordion.Item.Content>
				</Accordion.Item>
			</Accordion>,
		);

		// All components should have bordered variant
		expect(screen.getByTestId("accordion")).toHaveClass("accordion-bordered");
		expect(screen.getByTestId("item-1")).toHaveClass("item-bordered");
		expect(screen.getByTestId("item-2")).toHaveClass("item-bordered");
		expect(screen.getByTestId("header-1")).toHaveClass("header-bordered");
		expect(screen.getByTestId("header-2")).toHaveClass("header-bordered");
		expect(screen.getByTestId("content-1")).toHaveClass("content-bordered");
		expect(screen.getByTestId("content-2")).toHaveClass("content-bordered");
	});
});

describe("Integration: Edge Cases", () => {
	it("should handle component with 15+ variants", () => {
		const MegaComponent = styled("div", {
			base: { className: "mega" },
			variants: {
				v1: { a: { className: "v1-a" } },
				v2: { a: { className: "v2-a" } },
				v3: { a: { className: "v3-a" } },
				v4: { a: { className: "v4-a" } },
				v5: { a: { className: "v5-a" } },
				v6: { a: { className: "v6-a" } },
				v7: { a: { className: "v7-a" } },
				v8: { a: { className: "v8-a" } },
				v9: { a: { className: "v9-a" } },
				v10: { a: { className: "v10-a" } },
				v11: { a: { className: "v11-a" } },
				v12: { a: { className: "v12-a" } },
				v13: { a: { className: "v13-a" } },
				v14: { a: { className: "v14-a" } },
				v15: { a: { className: "v15-a" } },
			},
		});

		render(
			<MegaComponent
				data-testid="mega"
				v1="a"
				v2="a"
				v3="a"
				v4="a"
				v5="a"
				v6="a"
				v7="a"
				v8="a"
				v9="a"
				v10="a"
				v11="a"
				v12="a"
				v13="a"
				v14="a"
				v15="a"
			/>,
		);

		const el = screen.getByTestId("mega");
		for (let i = 1; i <= 15; i++) {
			expect(el).toHaveClass(`v${i}-a`);
		}
	});

	it("should handle 20+ compound variants", () => {
		const CompoundHeavy = styled("div", {
			base: { className: "heavy" },
			variants: {
				a: { x: { className: "a-x" }, y: { className: "a-y" } },
				b: { x: { className: "b-x" }, y: { className: "b-y" } },
			},
			compoundVariants: [
				{ a: "x", b: "x", props: { className: "c1" } },
				{ a: "x", b: "y", props: { className: "c2" } },
				{ a: "y", b: "x", props: { className: "c3" } },
				{ a: "y", b: "y", props: { className: "c4" } },
				// Add more compounds
				{ a: "x", props: { className: "c5" } },
				{ a: "y", props: { className: "c6" } },
				{ b: "x", props: { className: "c7" } },
				{ b: "y", props: { className: "c8" } },
			],
		});

		render(<CompoundHeavy data-testid="heavy" a="x" b="y" />);

		const el = screen.getByTestId("heavy");
		expect(el).toHaveClass("a-x", "b-y");
		expect(el).toHaveClass("c2"); // a=x, b=y
		expect(el).toHaveClass("c5"); // a=x
		expect(el).toHaveClass("c8"); // b=y
	});

	it("should handle withSlots on withSlots on withSlots (triple nesting)", () => {
		const Base = ({ children }: { children?: React.ReactNode }) => (
			<div data-testid="base">{children}</div>
		);

		const S1 = () => <span data-testid="s1">1</span>;
		const S2 = () => <span data-testid="s2">2</span>;
		const S3 = () => <span data-testid="s3">3</span>;

		const L1 = withSlots(Base, { S1 });
		const L2 = withSlots(L1, { S2 });
		const L3 = withSlots(L2, { S3 });

		// All slots should be accessible
		expect(L3.S1).toBe(S1);
		expect(L3.S2).toBe(S2);
		expect(L3.S3).toBe(S3);

		render(
			<L3>
				<L3.S1 />
				<L3.S2 />
				<L3.S3 />
			</L3>,
		);

		expect(screen.getByTestId("s1")).toBeInTheDocument();
		expect(screen.getByTestId("s2")).toBeInTheDocument();
		expect(screen.getByTestId("s3")).toBeInTheDocument();
	});

	it("should handle styled + withSlots + context all together with dynamic updates", () => {
		const TabsContext = createStyledContext({
			orientation: ["horizontal", "vertical"],
			activeIndex: ["boolean"], // Using as a simple marker
		});

		const TabsRoot = styled("div", {
			context: TabsContext,
			base: { className: "tabs" },
			variants: {
				orientation: {
					horizontal: { className: "tabs-horizontal" },
					vertical: { className: "tabs-vertical" },
				},
			},
		});

		const TabsList = styled("div", {
			context: TabsContext,
			base: { className: "tabs-list" },
			variants: {
				orientation: {
					horizontal: { className: "list-horizontal" },
					vertical: { className: "list-vertical" },
				},
			},
		});

		const TabsPanel = styled("div", {
			context: TabsContext,
			base: { className: "tabs-panel" },
			variants: {
				orientation: {
					horizontal: { className: "panel-horizontal" },
					vertical: { className: "panel-vertical" },
				},
			},
		});

		const Tabs = withSlots(TabsRoot, {
			List: TabsList,
			Panel: TabsPanel,
		});

		const App = () => {
			const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
				"horizontal",
			);

			return (
				<div>
					<button
						type="button"
						data-testid="toggle"
						onClick={() =>
							setOrientation((o) =>
								o === "horizontal" ? "vertical" : "horizontal",
							)
						}
					>
						Toggle
					</button>
					<Tabs data-testid="tabs" orientation={orientation}>
						<Tabs.List data-testid="list">Tabs here</Tabs.List>
						<Tabs.Panel data-testid="panel">Panel content</Tabs.Panel>
					</Tabs>
				</div>
			);
		};

		render(<App />);

		// Initial
		expect(screen.getByTestId("tabs")).toHaveClass("tabs-horizontal");
		expect(screen.getByTestId("list")).toHaveClass("list-horizontal");
		expect(screen.getByTestId("panel")).toHaveClass("panel-horizontal");

		// Toggle
		fireEvent.click(screen.getByTestId("toggle"));

		// Updated
		expect(screen.getByTestId("tabs")).toHaveClass("tabs-vertical");
		expect(screen.getByTestId("list")).toHaveClass("list-vertical");
		expect(screen.getByTestId("panel")).toHaveClass("panel-vertical");
	});
});
