import { describe, expect, it } from "bun:test";
import { fireEvent, render, screen } from "@better-styled/testing";
import { createStyledContext, styled } from "better-styled";
import { useState } from "react";

describe("createStyledContext", () => {
	describe("basic functionality", () => {
		it("should create a context with Provider and useVariants", () => {
			const ButtonContext = createStyledContext({
				variant: ["primary", "secondary"],
				size: ["sm", "md", "lg"],
			});

			expect(ButtonContext.Context).toBeDefined();
			expect(ButtonContext.Provider).toBeDefined();
			expect(ButtonContext.useVariants).toBeDefined();
			expect(ButtonContext.variantKeys).toEqual({
				variant: ["primary", "secondary"],
				size: ["sm", "md", "lg"],
			});
		});

		it("should return null from useVariants when outside Provider", () => {
			const TestContext = createStyledContext({
				variant: ["a", "b"],
			});

			const TestConsumer = () => {
				const variants = TestContext.useVariants();
				return (
					<div data-testid="result">
						{variants === null ? "null" : "has value"}
					</div>
				);
			};

			render(<TestConsumer />);
			expect(screen.getByTestId("result")).toHaveTextContent("null");
		});
	});

	describe("variant propagation", () => {
		it("should propagate variants from parent to child", () => {
			const ButtonContext = createStyledContext({
				variant: ["primary", "secondary"],
				size: ["sm", "md", "lg"],
			});

			const ButtonRoot = styled("button", {
				context: ButtonContext,
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

			const ButtonText = styled("span", {
				context: ButtonContext,
				base: { className: "btn-text" },
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
			});

			render(
				<ButtonRoot data-testid="button" variant="secondary" size="lg">
					<ButtonText data-testid="text">Click me</ButtonText>
				</ButtonRoot>,
			);

			const button = screen.getByTestId("button");
			const text = screen.getByTestId("text");

			// Parent should have correct classes
			expect(button).toHaveClass("btn", "btn-secondary", "btn-lg");

			// Child should inherit parent's variants
			expect(text).toHaveClass("btn-text", "text-secondary", "text-lg");
		});

		it("should allow child to override parent variants", () => {
			const CardContext = createStyledContext({
				variant: ["default", "elevated"],
			});

			const CardRoot = styled("div", {
				context: CardContext,
				base: { className: "card" },
				variants: {
					variant: {
						default: { className: "card-default" },
						elevated: { className: "card-elevated" },
					},
				},
				defaultVariants: {
					variant: "default",
				},
			});

			const CardHeader = styled("header", {
				context: CardContext,
				base: { className: "card-header" },
				variants: {
					variant: {
						default: { className: "header-default" },
						elevated: { className: "header-elevated" },
					},
				},
			});

			render(
				<CardRoot data-testid="card" variant="elevated">
					<CardHeader data-testid="header" variant="default">
						Title
					</CardHeader>
				</CardRoot>,
			);

			const card = screen.getByTestId("card");
			const header = screen.getByTestId("header");

			// Card uses elevated
			expect(card).toHaveClass("card-elevated");

			// Header overrides with default (and becomes new root for its children)
			expect(header).toHaveClass("header-default");
		});

		it("should use default variants when no parent context", () => {
			const AlertContext = createStyledContext({
				severity: ["info", "warning", "error"],
			});

			const AlertRoot = styled("div", {
				context: AlertContext,
				base: { className: "alert" },
				variants: {
					severity: {
						info: { className: "alert-info" },
						warning: { className: "alert-warning" },
						error: { className: "alert-error" },
					},
				},
				defaultVariants: {
					severity: "info",
				},
			});

			render(<AlertRoot data-testid="alert" />);

			const alert = screen.getByTestId("alert");
			expect(alert).toHaveClass("alert", "alert-info");
		});
	});

	describe("boolean variants with context", () => {
		it("should propagate boolean variants", () => {
			const InputContext = createStyledContext({
				disabled: ["boolean"],
			});

			const InputRoot = styled("div", {
				context: InputContext,
				base: { className: "input-root" },
				variants: {
					disabled: {
						true: { className: "input-disabled" },
						false: { className: "input-enabled" },
					},
				},
				defaultVariants: {
					disabled: false,
				},
			});

			const InputLabel = styled("label", {
				context: InputContext,
				base: { className: "input-label" },
				variants: {
					disabled: {
						true: { className: "label-disabled" },
						false: { className: "label-enabled" },
					},
				},
			});

			render(
				<InputRoot data-testid="root" disabled>
					<InputLabel data-testid="label">Name</InputLabel>
				</InputRoot>,
			);

			expect(screen.getByTestId("root")).toHaveClass("input-disabled");
			expect(screen.getByTestId("label")).toHaveClass("label-disabled");
		});
	});

	describe("nested context components", () => {
		it("should handle deeply nested components", () => {
			const ListContext = createStyledContext({
				variant: ["default", "bordered"],
			});

			const List = styled("ul", {
				context: ListContext,
				base: { className: "list" },
				variants: {
					variant: {
						default: { className: "list-default" },
						bordered: { className: "list-bordered" },
					},
				},
				defaultVariants: {
					variant: "default",
				},
			});

			const ListItem = styled("li", {
				context: ListContext,
				base: { className: "list-item" },
				variants: {
					variant: {
						default: { className: "item-default" },
						bordered: { className: "item-bordered" },
					},
				},
			});

			const ListItemText = styled("span", {
				context: ListContext,
				base: { className: "item-text" },
				variants: {
					variant: {
						default: { className: "text-default" },
						bordered: { className: "text-bordered" },
					},
				},
			});

			render(
				<List data-testid="list" variant="bordered">
					<ListItem data-testid="item">
						<ListItemText data-testid="text">Item 1</ListItemText>
					</ListItem>
				</List>,
			);

			expect(screen.getByTestId("list")).toHaveClass("list-bordered");
			expect(screen.getByTestId("item")).toHaveClass("item-bordered");
			expect(screen.getByTestId("text")).toHaveClass("text-bordered");
		});
	});

	// ============================================================================
	// ADVANCED TESTS
	// ============================================================================

	describe("deeply nested context propagation (4+ levels)", () => {
		it("should propagate variants through 4 levels of nesting", () => {
			const TreeContext = createStyledContext({
				theme: ["light", "dark"],
				size: ["sm", "md", "lg"],
			});

			const Level1 = styled("div", {
				context: TreeContext,
				base: { className: "level-1" },
				variants: {
					theme: {
						light: { className: "l1-light" },
						dark: { className: "l1-dark" },
					},
					size: {
						sm: { className: "l1-sm" },
						md: { className: "l1-md" },
						lg: { className: "l1-lg" },
					},
				},
			});

			const Level2 = styled("div", {
				context: TreeContext,
				base: { className: "level-2" },
				variants: {
					theme: {
						light: { className: "l2-light" },
						dark: { className: "l2-dark" },
					},
					size: {
						sm: { className: "l2-sm" },
						md: { className: "l2-md" },
						lg: { className: "l2-lg" },
					},
				},
			});

			const Level3 = styled("div", {
				context: TreeContext,
				base: { className: "level-3" },
				variants: {
					theme: {
						light: { className: "l3-light" },
						dark: { className: "l3-dark" },
					},
					size: {
						sm: { className: "l3-sm" },
						md: { className: "l3-md" },
						lg: { className: "l3-lg" },
					},
				},
			});

			const Level4 = styled("div", {
				context: TreeContext,
				base: { className: "level-4" },
				variants: {
					theme: {
						light: { className: "l4-light" },
						dark: { className: "l4-dark" },
					},
					size: {
						sm: { className: "l4-sm" },
						md: { className: "l4-md" },
						lg: { className: "l4-lg" },
					},
				},
			});

			render(
				<Level1 data-testid="l1" theme="dark" size="lg">
					<Level2 data-testid="l2">
						<Level3 data-testid="l3">
							<Level4 data-testid="l4">Deepest</Level4>
						</Level3>
					</Level2>
				</Level1>,
			);

			// All levels should inherit theme="dark" and size="lg"
			expect(screen.getByTestId("l1")).toHaveClass("l1-dark", "l1-lg");
			expect(screen.getByTestId("l2")).toHaveClass("l2-dark", "l2-lg");
			expect(screen.getByTestId("l3")).toHaveClass("l3-dark", "l3-lg");
			expect(screen.getByTestId("l4")).toHaveClass("l4-dark", "l4-lg");
		});

		it("should allow override at any level and propagate new value downward", () => {
			const TreeContext = createStyledContext({
				variant: ["a", "b", "c"],
			});

			const Node = styled("div", {
				context: TreeContext,
				base: { className: "node" },
				variants: {
					variant: {
						a: { className: "variant-a" },
						b: { className: "variant-b" },
						c: { className: "variant-c" },
					},
				},
			});

			render(
				<Node data-testid="n1" variant="a">
					<Node data-testid="n2">
						<Node data-testid="n3" variant="b">
							<Node data-testid="n4">
								<Node data-testid="n5">Deep child</Node>
							</Node>
						</Node>
					</Node>
				</Node>,
			);

			// n1 sets "a", n2 inherits "a"
			expect(screen.getByTestId("n1")).toHaveClass("variant-a");
			expect(screen.getByTestId("n2")).toHaveClass("variant-a");

			// n3 overrides to "b", n4 and n5 inherit "b"
			expect(screen.getByTestId("n3")).toHaveClass("variant-b");
			expect(screen.getByTestId("n4")).toHaveClass("variant-b");
			expect(screen.getByTestId("n5")).toHaveClass("variant-b");
		});

		it("should isolate sibling branches (override in one doesn't affect other)", () => {
			const BranchContext = createStyledContext({
				color: ["red", "blue", "green"],
			});

			const Container = styled("div", {
				context: BranchContext,
				base: { className: "container" },
				variants: {
					color: {
						red: { className: "color-red" },
						blue: { className: "color-blue" },
						green: { className: "color-green" },
					},
				},
			});

			const Item = styled("span", {
				context: BranchContext,
				base: { className: "item" },
				variants: {
					color: {
						red: { className: "item-red" },
						blue: { className: "item-blue" },
						green: { className: "item-green" },
					},
				},
			});

			render(
				<Container data-testid="root" color="red">
					<Container data-testid="branch-a" color="blue">
						<Item data-testid="item-a">A</Item>
					</Container>
					<Container data-testid="branch-b" color="green">
						<Item data-testid="item-b">B</Item>
					</Container>
					<Item data-testid="item-root">Root</Item>
				</Container>,
			);

			// Root is red
			expect(screen.getByTestId("root")).toHaveClass("color-red");
			expect(screen.getByTestId("item-root")).toHaveClass("item-red");

			// Branch A is blue (isolated)
			expect(screen.getByTestId("branch-a")).toHaveClass("color-blue");
			expect(screen.getByTestId("item-a")).toHaveClass("item-blue");

			// Branch B is green (isolated from A)
			expect(screen.getByTestId("branch-b")).toHaveClass("color-green");
			expect(screen.getByTestId("item-b")).toHaveClass("item-green");
		});
	});

	describe("multiple isolated contexts", () => {
		it("should maintain isolation between different contexts", () => {
			const ThemeContext = createStyledContext({
				mode: ["light", "dark"],
			});

			const SizeContext = createStyledContext({
				size: ["sm", "md", "lg"],
			});

			const ThemedBox = styled("div", {
				context: ThemeContext,
				base: { className: "themed-box" },
				variants: {
					mode: {
						light: { className: "theme-light" },
						dark: { className: "theme-dark" },
					},
				},
			});

			const SizedBox = styled("div", {
				context: SizeContext,
				base: { className: "sized-box" },
				variants: {
					size: {
						sm: { className: "size-sm" },
						md: { className: "size-md" },
						lg: { className: "size-lg" },
					},
				},
			});

			const ThemedChild = styled("span", {
				context: ThemeContext,
				base: { className: "themed-child" },
				variants: {
					mode: {
						light: { className: "child-light" },
						dark: { className: "child-dark" },
					},
				},
			});

			const SizedChild = styled("span", {
				context: SizeContext,
				base: { className: "sized-child" },
				variants: {
					size: {
						sm: { className: "child-sm" },
						md: { className: "child-md" },
						lg: { className: "child-lg" },
					},
				},
			});

			render(
				<ThemedBox data-testid="themed" mode="dark">
					<SizedBox data-testid="sized" size="lg">
						<ThemedChild data-testid="themed-child">Theme</ThemedChild>
						<SizedChild data-testid="sized-child">Size</SizedChild>
					</SizedBox>
				</ThemedBox>,
			);

			// Theme context propagates correctly
			expect(screen.getByTestId("themed")).toHaveClass("theme-dark");
			expect(screen.getByTestId("themed-child")).toHaveClass("child-dark");

			// Size context propagates correctly
			expect(screen.getByTestId("sized")).toHaveClass("size-lg");
			expect(screen.getByTestId("sized-child")).toHaveClass("child-lg");

			// No cross-contamination
			expect(screen.getByTestId("themed-child")).not.toHaveClass("child-lg");
			expect(screen.getByTestId("sized-child")).not.toHaveClass("child-dark");
		});

		it("should NOT have cross-contamination between contexts with same variant names", () => {
			const ContextA = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const ContextB = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const CompA = styled("div", {
				context: ContextA,
				base: { className: "comp-a" },
				variants: {
					variant: {
						primary: { className: "a-primary" },
						secondary: { className: "a-secondary" },
					},
				},
			});

			const CompB = styled("div", {
				context: ContextB,
				base: { className: "comp-b" },
				variants: {
					variant: {
						primary: { className: "b-primary" },
						secondary: { className: "b-secondary" },
					},
				},
			});

			const ChildA = styled("span", {
				context: ContextA,
				base: {},
				variants: {
					variant: {
						primary: { className: "child-a-primary" },
						secondary: { className: "child-a-secondary" },
					},
				},
			});

			const ChildB = styled("span", {
				context: ContextB,
				base: {},
				variants: {
					variant: {
						primary: { className: "child-b-primary" },
						secondary: { className: "child-b-secondary" },
					},
				},
			});

			render(
				<CompA data-testid="comp-a" variant="primary">
					<CompB data-testid="comp-b" variant="secondary">
						<ChildA data-testid="child-a">A</ChildA>
						<ChildB data-testid="child-b">B</ChildB>
					</CompB>
				</CompA>,
			);

			// ChildA should get "primary" from ContextA (outer)
			expect(screen.getByTestId("child-a")).toHaveClass("child-a-primary");
			// ChildB should get "secondary" from ContextB (inner)
			expect(screen.getByTestId("child-b")).toHaveClass("child-b-secondary");
		});
	});

	describe("dynamic context updates", () => {
		it("should re-render children when parent variant prop changes", () => {
			const DynamicContext = createStyledContext({
				status: ["idle", "loading", "success", "error"],
			});

			const Container = styled("div", {
				context: DynamicContext,
				base: { className: "container" },
				variants: {
					status: {
						idle: { className: "status-idle" },
						loading: { className: "status-loading" },
						success: { className: "status-success" },
						error: { className: "status-error" },
					},
				},
			});

			const StatusIndicator = styled("span", {
				context: DynamicContext,
				base: { className: "indicator" },
				variants: {
					status: {
						idle: { className: "ind-idle" },
						loading: { className: "ind-loading" },
						success: { className: "ind-success" },
						error: { className: "ind-error" },
					},
				},
			});

			const App = () => {
				const [status, setStatus] = useState<
					"idle" | "loading" | "success" | "error"
				>("idle");

				return (
					<div>
						<button
							type="button"
							data-testid="change-btn"
							onClick={() => setStatus("success")}
						>
							Change
						</button>
						<Container data-testid="container" status={status}>
							<StatusIndicator data-testid="indicator">Status</StatusIndicator>
						</Container>
					</div>
				);
			};

			render(<App />);

			// Initial state
			expect(screen.getByTestId("container")).toHaveClass("status-idle");
			expect(screen.getByTestId("indicator")).toHaveClass("ind-idle");

			// Change status
			fireEvent.click(screen.getByTestId("change-btn"));

			// Updated state
			expect(screen.getByTestId("container")).toHaveClass("status-success");
			expect(screen.getByTestId("indicator")).toHaveClass("ind-success");
		});

		it("should update all descendants when provider value changes", () => {
			const DeepContext = createStyledContext({
				active: ["boolean"],
			});

			const Wrapper = styled("div", {
				context: DeepContext,
				base: { className: "wrapper" },
				variants: {
					active: {
						true: { className: "wrapper-active" },
						false: { className: "wrapper-inactive" },
					},
				},
			});

			const Level1 = styled("div", {
				context: DeepContext,
				base: { className: "l1" },
				variants: {
					active: {
						true: { className: "l1-active" },
						false: { className: "l1-inactive" },
					},
				},
			});

			const Level2 = styled("div", {
				context: DeepContext,
				base: { className: "l2" },
				variants: {
					active: {
						true: { className: "l2-active" },
						false: { className: "l2-inactive" },
					},
				},
			});

			const Level3 = styled("div", {
				context: DeepContext,
				base: { className: "l3" },
				variants: {
					active: {
						true: { className: "l3-active" },
						false: { className: "l3-inactive" },
					},
				},
			});

			const App = () => {
				const [active, setActive] = useState(false);

				return (
					<div>
						<button
							type="button"
							data-testid="toggle"
							onClick={() => setActive(!active)}
						>
							Toggle
						</button>
						<Wrapper data-testid="wrapper" active={active}>
							<Level1 data-testid="l1">
								<Level2 data-testid="l2">
									<Level3 data-testid="l3">Deep</Level3>
								</Level2>
							</Level1>
						</Wrapper>
					</div>
				);
			};

			render(<App />);

			// Initial: all inactive
			expect(screen.getByTestId("wrapper")).toHaveClass("wrapper-inactive");
			expect(screen.getByTestId("l1")).toHaveClass("l1-inactive");
			expect(screen.getByTestId("l2")).toHaveClass("l2-inactive");
			expect(screen.getByTestId("l3")).toHaveClass("l3-inactive");

			// Toggle to active
			fireEvent.click(screen.getByTestId("toggle"));

			// All should be active
			expect(screen.getByTestId("wrapper")).toHaveClass("wrapper-active");
			expect(screen.getByTestId("l1")).toHaveClass("l1-active");
			expect(screen.getByTestId("l2")).toHaveClass("l2-active");
			expect(screen.getByTestId("l3")).toHaveClass("l3-active");
		});

		it("should handle rapid variant changes without stale values", async () => {
			const RapidContext = createStyledContext({
				count: ["zero", "one", "two", "three"],
			});

			const Counter = styled("div", {
				context: RapidContext,
				base: { className: "counter" },
				variants: {
					count: {
						zero: { className: "count-0" },
						one: { className: "count-1" },
						two: { className: "count-2" },
						three: { className: "count-3" },
					},
				},
			});

			const Display = styled("span", {
				context: RapidContext,
				base: { className: "display" },
				variants: {
					count: {
						zero: { className: "display-0" },
						one: { className: "display-1" },
						two: { className: "display-2" },
						three: { className: "display-3" },
					},
				},
			});

			const counts = ["zero", "one", "two", "three"] as const;

			const App = () => {
				const [index, setIndex] = useState(0);

				return (
					<div>
						<button
							type="button"
							data-testid="next"
							onClick={() => setIndex((i) => i + 1)}
						>
							Next
						</button>
						<Counter data-testid="counter" count={counts[index]}>
							<Display data-testid="display">Value</Display>
						</Counter>
					</div>
				);
			};

			render(<App />);

			expect(screen.getByTestId("counter")).toHaveClass("count-0");
			expect(screen.getByTestId("display")).toHaveClass("display-0");

			// Rapid clicks
			fireEvent.click(screen.getByTestId("next"));
			expect(screen.getByTestId("counter")).toHaveClass("count-1");
			expect(screen.getByTestId("display")).toHaveClass("display-1");

			fireEvent.click(screen.getByTestId("next"));
			expect(screen.getByTestId("counter")).toHaveClass("count-2");
			expect(screen.getByTestId("display")).toHaveClass("display-2");

			fireEvent.click(screen.getByTestId("next"));
			expect(screen.getByTestId("counter")).toHaveClass("count-3");
			expect(screen.getByTestId("display")).toHaveClass("display-3");
		});
	});

	describe("boolean variants in context", () => {
		it("should propagate boolean true through context", () => {
			const BoolContext = createStyledContext({
				enabled: ["boolean"],
				visible: ["boolean"],
			});

			const Parent = styled("div", {
				context: BoolContext,
				base: { className: "parent" },
				variants: {
					enabled: {
						true: { className: "parent-enabled" },
						false: { className: "parent-disabled" },
					},
					visible: {
						true: { className: "parent-visible" },
						false: { className: "parent-hidden" },
					},
				},
			});

			const Child = styled("span", {
				context: BoolContext,
				base: { className: "child" },
				variants: {
					enabled: {
						true: { className: "child-enabled" },
						false: { className: "child-disabled" },
					},
					visible: {
						true: { className: "child-visible" },
						false: { className: "child-hidden" },
					},
				},
			});

			render(
				<Parent data-testid="parent" enabled visible>
					<Child data-testid="child">Content</Child>
				</Parent>,
			);

			expect(screen.getByTestId("parent")).toHaveClass(
				"parent-enabled",
				"parent-visible",
			);
			expect(screen.getByTestId("child")).toHaveClass(
				"child-enabled",
				"child-visible",
			);
		});

		it("should propagate boolean false through context", () => {
			const BoolContext = createStyledContext({
				active: ["boolean"],
			});

			const Parent = styled("div", {
				context: BoolContext,
				base: { className: "parent" },
				variants: {
					active: {
						true: { className: "parent-active" },
						false: { className: "parent-inactive" },
					},
				},
			});

			const Child = styled("span", {
				context: BoolContext,
				base: { className: "child" },
				variants: {
					active: {
						true: { className: "child-active" },
						false: { className: "child-inactive" },
					},
				},
			});

			render(
				<Parent data-testid="parent" active={false}>
					<Child data-testid="child">Content</Child>
				</Parent>,
			);

			expect(screen.getByTestId("parent")).toHaveClass("parent-inactive");
			expect(screen.getByTestId("child")).toHaveClass("child-inactive");
		});

		it("should override boolean from parent with boolean in child", () => {
			const BoolContext = createStyledContext({
				disabled: ["boolean"],
			});

			const Outer = styled("div", {
				context: BoolContext,
				base: { className: "outer" },
				variants: {
					disabled: {
						true: { className: "outer-disabled" },
						false: { className: "outer-enabled" },
					},
				},
			});

			const Inner = styled("div", {
				context: BoolContext,
				base: { className: "inner" },
				variants: {
					disabled: {
						true: { className: "inner-disabled" },
						false: { className: "inner-enabled" },
					},
				},
			});

			const Leaf = styled("span", {
				context: BoolContext,
				base: { className: "leaf" },
				variants: {
					disabled: {
						true: { className: "leaf-disabled" },
						false: { className: "leaf-enabled" },
					},
				},
			});

			render(
				<Outer data-testid="outer" disabled>
					<Inner data-testid="inner" disabled={false}>
						<Leaf data-testid="leaf">Text</Leaf>
					</Inner>
				</Outer>,
			);

			// Outer is disabled
			expect(screen.getByTestId("outer")).toHaveClass("outer-disabled");
			// Inner overrides to enabled
			expect(screen.getByTestId("inner")).toHaveClass("inner-enabled");
			// Leaf inherits from Inner (enabled)
			expect(screen.getByTestId("leaf")).toHaveClass("leaf-enabled");
		});

		it("should handle mixed boolean and string variants", () => {
			const MixedContext = createStyledContext({
				variant: ["primary", "secondary"],
				disabled: ["boolean"],
				size: ["sm", "md", "lg"],
			});

			const Box = styled("div", {
				context: MixedContext,
				base: { className: "box" },
				variants: {
					variant: {
						primary: { className: "box-primary" },
						secondary: { className: "box-secondary" },
					},
					disabled: {
						true: { className: "box-disabled" },
						false: { className: "box-enabled" },
					},
					size: {
						sm: { className: "box-sm" },
						md: { className: "box-md" },
						lg: { className: "box-lg" },
					},
				},
			});

			const Text = styled("span", {
				context: MixedContext,
				base: { className: "text" },
				variants: {
					variant: {
						primary: { className: "text-primary" },
						secondary: { className: "text-secondary" },
					},
					disabled: {
						true: { className: "text-disabled" },
						false: { className: "text-enabled" },
					},
					size: {
						sm: { className: "text-sm" },
						md: { className: "text-md" },
						lg: { className: "text-lg" },
					},
				},
			});

			render(
				<Box data-testid="box" variant="primary" disabled size="lg">
					<Text data-testid="text">Hello</Text>
				</Box>,
			);

			// Box should have all variant classes
			expect(screen.getByTestId("box")).toHaveClass("box-primary");
			expect(screen.getByTestId("box")).toHaveClass("box-disabled");
			expect(screen.getByTestId("box")).toHaveClass("box-lg");

			// Text should inherit disabled and size from context
			// Note: variant propagation depends on context implementation
			expect(screen.getByTestId("text")).toHaveClass("text-disabled");
			expect(screen.getByTestId("text")).toHaveClass("text-lg");
		});
	});

	describe("edge cases", () => {
		it("should render correctly without any provider in tree", () => {
			const OrphanContext = createStyledContext({
				mood: ["happy", "sad"],
			});

			const OrphanChild = styled("div", {
				context: OrphanContext,
				base: { className: "orphan" },
				variants: {
					mood: {
						happy: { className: "mood-happy" },
						sad: { className: "mood-sad" },
					},
				},
				defaultVariants: {
					mood: "happy",
				},
			});

			render(<OrphanChild data-testid="orphan" />);

			// Should use defaultVariants
			expect(screen.getByTestId("orphan")).toHaveClass("mood-happy");
		});

		it("should handle context with single variant option", () => {
			const SingleContext = createStyledContext({
				type: ["only"],
			});

			const SingleComp = styled("div", {
				context: SingleContext,
				base: { className: "single" },
				variants: {
					type: {
						only: { className: "type-only" },
					},
				},
			});

			const SingleChild = styled("span", {
				context: SingleContext,
				base: { className: "child" },
				variants: {
					type: {
						only: { className: "child-only" },
					},
				},
			});

			render(
				<SingleComp data-testid="parent" type="only">
					<SingleChild data-testid="child">Only option</SingleChild>
				</SingleComp>,
			);

			expect(screen.getByTestId("parent")).toHaveClass("type-only");
			expect(screen.getByTestId("child")).toHaveClass("child-only");
		});

		it("should handle 10+ levels of nesting without issues", () => {
			const DeepContext = createStyledContext({
				depth: ["shallow", "deep"],
			});

			const Level = styled("div", {
				context: DeepContext,
				base: { className: "level" },
				variants: {
					depth: {
						shallow: { className: "depth-shallow" },
						deep: { className: "depth-deep" },
					},
				},
			});

			render(
				<Level data-testid="l1" depth="deep">
					<Level data-testid="l2">
						<Level data-testid="l3">
							<Level data-testid="l4">
								<Level data-testid="l5">
									<Level data-testid="l6">
										<Level data-testid="l7">
											<Level data-testid="l8">
												<Level data-testid="l9">
													<Level data-testid="l10">Deepest</Level>
												</Level>
											</Level>
										</Level>
									</Level>
								</Level>
							</Level>
						</Level>
					</Level>
				</Level>,
			);

			// All 10 levels should have "depth-deep"
			for (let i = 1; i <= 10; i++) {
				expect(screen.getByTestId(`l${i}`)).toHaveClass("depth-deep");
			}
		});
	});
});
