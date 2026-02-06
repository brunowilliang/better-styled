import { describe, expect, it } from "bun:test";
import { render, screen } from "@better-styled/testing";
import {
	createStyledContext,
	styled,
	styledConfig,
	withSlots,
} from "better-styled";

describe("styledConfig", () => {
	describe("identity", () => {
		it("should return the same config reference", () => {
			const config = {
				base: { className: "btn" },
				variants: {
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
			};

			const result = styledConfig(["button", "a"], config);
			expect(result).toBe(config);
		});
	});

	describe("rendering with styled()", () => {
		it("should render component with base classes from shared config", () => {
			const config = styledConfig(["button", "a"], {
				base: { className: "shared-base" },
			});

			const Button = styled("button", config);

			render(<Button data-testid="btn">Click</Button>);

			const button = screen.getByTestId("btn");
			expect(button).toBeInTheDocument();
			expect(button).toHaveClass("shared-base");
			expect(button).toHaveTextContent("Click");
		});

		it("should apply variant classes from shared config", () => {
			const config = styledConfig(["button", "a"], {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
			});

			const Button = styled("button", config);

			render(<Button data-testid="btn" variant="primary" size="lg" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn");
			expect(button).toHaveClass("btn-primary");
			expect(button).toHaveClass("btn-lg");
		});

		it("should apply defaultVariants from shared config", () => {
			const config = styledConfig(["button", "a"], {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
				},
				defaultVariants: {
					variant: "primary",
				},
			});

			const Button = styled("button", config);

			render(<Button data-testid="btn" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
		});

		it("should apply compoundVariants from shared config", () => {
			const config = styledConfig(["button", "a"], {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						danger: { className: "btn-danger" },
					},
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
				compoundVariants: [
					{
						variant: "danger",
						size: "lg",
						props: { className: "compound-danger-lg" },
					},
				],
			});

			const Button = styled("button", config);

			render(<Button data-testid="btn" variant="danger" size="lg" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-danger");
			expect(button).toHaveClass("btn-lg");
			expect(button).toHaveClass("compound-danger-lg");
		});

		it("should render both components from tuple correctly with same config", () => {
			const config = styledConfig(["button", "a"], {
				base: { className: "shared-base" },
				variants: {
					variant: {
						primary: { className: "variant-primary" },
						secondary: { className: "variant-secondary" },
					},
				},
			});

			const Button = styled("button", config);
			const Link = styled("a", config);

			render(
				<div>
					<Button data-testid="btn" variant="primary" />
					<Link data-testid="link" variant="secondary" />
				</div>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("shared-base");
			expect(button).toHaveClass("variant-primary");
			expect(button.tagName).toBe("BUTTON");

			const link = screen.getByTestId("link");
			expect(link).toHaveClass("shared-base");
			expect(link).toHaveClass("variant-secondary");
			expect(link.tagName).toBe("A");
		});
	});

	describe("context propagation", () => {
		it("should propagate variants from parent to child via shared config", () => {
			const Ctx = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const config = styledConfig(["div", "button"], {
				context: Ctx,
				base: { className: "shared" },
				variants: {
					variant: {
						primary: { className: "variant-primary" },
						secondary: { className: "variant-secondary" },
					},
				},
			});

			const Parent = styled("div", config);
			const Child = styled("button", config);

			render(
				<Parent variant="secondary">
					<Child data-testid="child" />
				</Parent>,
			);

			const child = screen.getByTestId("child");
			expect(child).toHaveClass("variant-secondary");
			expect(child).not.toHaveClass("variant-primary");
		});

		it("should allow child to override context variant via direct prop", () => {
			const Ctx = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const config = styledConfig(["div", "button"], {
				context: Ctx,
				base: { className: "shared" },
				variants: {
					variant: {
						primary: { className: "variant-primary" },
						secondary: { className: "variant-secondary" },
					},
				},
			});

			const Parent = styled("div", config);
			const Child = styled("button", config);

			render(
				<Parent variant="secondary">
					<Child data-testid="child" variant="primary" />
				</Parent>,
			);

			const child = screen.getByTestId("child");
			expect(child).toHaveClass("variant-primary");
			expect(child).not.toHaveClass("variant-secondary");
		});

		it("should propagate defaultVariants through context", () => {
			const Ctx = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const parentConfig = styledConfig(["div", "div"], {
				context: Ctx,
				base: { className: "parent" },
				variants: {
					variant: {
						primary: { className: "parent-primary" },
						secondary: { className: "parent-secondary" },
					},
				},
				defaultVariants: {
					variant: "secondary",
				},
			});

			const childConfig = styledConfig(["button", "span"], {
				context: Ctx,
				base: { className: "child" },
				variants: {
					variant: {
						primary: { className: "child-primary" },
						secondary: { className: "child-secondary" },
					},
				},
			});

			const Parent = styled("div", parentConfig);
			const Child = styled("button", childConfig);

			render(
				<Parent>
					<Child data-testid="child" />
				</Parent>,
			);

			const child = screen.getByTestId("child");
			expect(child).toHaveClass("child-secondary");
		});
	});

	describe("local variants", () => {
		it("should apply local variant but not propagate via context", () => {
			const Ctx = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const config = styledConfig(["div", "button"], {
				context: Ctx,
				base: { className: "shared" },
				variants: {
					variant: {
						primary: { className: "variant-primary" },
						secondary: { className: "variant-secondary" },
					},
					isDisabled: {
						true: { className: "disabled-true" },
					},
				},
			});

			const Parent = styled("div", config);
			const Child = styled("button", config);

			render(
				<Parent variant="primary" isDisabled>
					<Child data-testid="child" />
				</Parent>,
			);

			const child = screen.getByTestId("child");
			// Context variant propagates
			expect(child).toHaveClass("variant-primary");
			// Local variant does NOT propagate
			expect(child).not.toHaveClass("disabled-true");
		});
	});

	describe("without context", () => {
		it("should render both components correctly without context", () => {
			const config = styledConfig(["button", "div"], {
				base: { className: "no-ctx-base" },
				variants: {
					size: {
						sm: { className: "size-sm" },
						lg: { className: "size-lg" },
					},
				},
				defaultVariants: {
					size: "sm",
				},
			});

			const Button = styled("button", config);
			const Box = styled("div", config);

			render(
				<div>
					<Button data-testid="btn" size="lg" />
					<Box data-testid="box" />
				</div>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("no-ctx-base");
			expect(button).toHaveClass("size-lg");

			const box = screen.getByTestId("box");
			expect(box).toHaveClass("no-ctx-base");
			expect(box).toHaveClass("size-sm");
		});
	});

	describe("with withSlots", () => {
		it("should work with withSlots for compound components", () => {
			const Ctx = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const config = styledConfig(["div", "span"], {
				context: Ctx,
				base: { className: "slot-base" },
				variants: {
					variant: {
						primary: { className: "slot-primary" },
						secondary: { className: "slot-secondary" },
					},
				},
			});

			const CardRoot = styled("div", config);
			const CardLabel = styled("span", config);

			const Card = withSlots(CardRoot, {
				Label: CardLabel,
			});

			render(
				<Card variant="primary">
					<Card.Label data-testid="label">Hello</Card.Label>
				</Card>,
			);

			const label = screen.getByTestId("label");
			expect(label).toHaveClass("slot-primary");
			expect(label).toHaveTextContent("Hello");
		});
	});
});
