import { describe, expect, it } from "bun:test";
import { fireEvent, render, screen } from "@better-styled/testing";
import { createStyledContext, styled } from "better-styled";

describe("styled", () => {
	describe("basic rendering", () => {
		it("should render a basic styled component", () => {
			const Button = styled("button", {
				base: { className: "base-class" },
			});

			render(<Button data-testid="btn">Click me</Button>);

			const button = screen.getByTestId("btn");
			expect(button).toBeInTheDocument();
			expect(button).toHaveClass("base-class");
			expect(button).toHaveTextContent("Click me");
		});

		it("should set displayName correctly", () => {
			const Button = styled("button", {
				base: { className: "btn" },
			});

			expect(Button.displayName).toBe("Styled(button)");
		});

		it("should merge className from props with base", () => {
			const Button = styled("button", {
				base: { className: "base-class" },
			});

			render(<Button data-testid="btn" className="custom-class" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("base-class");
			expect(button).toHaveClass("custom-class");
		});
	});

	describe("variants", () => {
		it("should apply variant classes", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
				},
			});

			render(<Button data-testid="btn" variant="primary" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn");
			expect(button).toHaveClass("btn-primary");
		});

		it("should apply multiple variants", () => {
			const Button = styled("button", {
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

			render(<Button data-testid="btn" variant="secondary" size="lg" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn");
			expect(button).toHaveClass("btn-secondary");
			expect(button).toHaveClass("btn-lg");
		});

		it("should apply boolean variants", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					disabled: {
						true: { className: "btn-disabled" },
						false: { className: "btn-enabled" },
					},
				},
			});

			render(<Button data-testid="btn" disabled />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-disabled");
		});
	});

	describe("defaultVariants", () => {
		it("should apply default variants when no variant prop is passed", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
					size: {
						sm: { className: "btn-sm" },
						md: { className: "btn-md" },
					},
				},
				defaultVariants: {
					variant: "primary",
					size: "md",
				},
			});

			render(<Button data-testid="btn" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
			expect(button).toHaveClass("btn-md");
		});

		it("should override default variants with props", () => {
			const Button = styled("button", {
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

			render(<Button data-testid="btn" variant="secondary" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-secondary");
			expect(button).not.toHaveClass("btn-primary");
		});
	});

	describe("compoundVariants", () => {
		it("should apply compound variant classes when conditions match", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						outline: { className: "btn-outline" },
					},
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
				compoundVariants: [
					{
						variant: "primary",
						size: "lg",
						props: { className: "compound-primary-lg" },
					},
				],
			});

			render(<Button data-testid="btn" variant="primary" size="lg" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
			expect(button).toHaveClass("btn-lg");
			expect(button).toHaveClass("compound-primary-lg");
		});

		it("should not apply compound variant when conditions do not match", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						outline: { className: "btn-outline" },
					},
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
				compoundVariants: [
					{
						variant: "primary",
						size: "lg",
						props: { className: "compound-primary-lg" },
					},
				],
			});

			render(<Button data-testid="btn" variant="primary" size="sm" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
			expect(button).toHaveClass("btn-sm");
			expect(button).not.toHaveClass("compound-primary-lg");
		});

		it("should apply multiple compound variants", () => {
			const Button = styled("button", {
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
					disabled: {
						true: { className: "btn-disabled" },
						false: {},
					},
				},
				compoundVariants: [
					{
						variant: "danger",
						disabled: true,
						props: { className: "danger-disabled" },
					},
					{
						variant: "danger",
						size: "lg",
						props: { className: "danger-lg" },
					},
				],
			});

			render(<Button data-testid="btn" variant="danger" size="lg" disabled />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("danger-disabled");
			expect(button).toHaveClass("danger-lg");
		});
	});

	describe("props forwarding", () => {
		it("should forward non-variant props to the element", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			render(
				<Button
					data-testid="btn"
					variant="primary"
					type="submit"
					aria-label="Submit form"
				/>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveAttribute("type", "submit");
			expect(button).toHaveAttribute("aria-label", "Submit form");
		});

		it("should not pass variant props to the DOM element", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					customVariant: {
						active: { className: "active" },
					},
				},
			});

			render(<Button data-testid="btn" customVariant="active" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("active");
			// customVariant should not be on the DOM element
			expect(button).not.toHaveAttribute("customVariant");
		});
	});

	// ============================================================================
	// ADVANCED TESTS
	// ============================================================================

	describe("advanced compound variants", () => {
		it("should apply MULTIPLE matching compound variants simultaneously", () => {
			const Button = styled("button", {
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
					disabled: {
						true: { className: "opacity-50" },
						false: { className: "opacity-100" },
					},
				},
				compoundVariants: [
					{
						variant: "danger",
						size: "lg",
						props: { className: "shadow-danger-lg" },
					},
					{
						variant: "danger",
						disabled: true,
						props: { className: "cursor-not-allowed" },
					},
					{
						size: "lg",
						disabled: true,
						props: { className: "pointer-events-none" },
					},
				],
			});

			render(<Button data-testid="btn" variant="danger" size="lg" disabled />);

			const button = screen.getByTestId("btn");
			// All three compound variants should match
			expect(button).toHaveClass("shadow-danger-lg");
			expect(button).toHaveClass("cursor-not-allowed");
			expect(button).toHaveClass("pointer-events-none");
		});

		it("should handle compound with boolean + string variants", () => {
			const Input = styled("input", {
				base: { className: "input" },
				variants: {
					size: {
						sm: { className: "input-sm" },
						lg: { className: "input-lg" },
					},
					hasError: {
						true: { className: "border-red-500" },
						false: { className: "border-gray-300" },
					},
					disabled: {
						true: { className: "bg-gray-100" },
						false: { className: "bg-white" },
					},
				},
				compoundVariants: [
					{
						hasError: true,
						disabled: false,
						props: { className: "ring-red-500" },
					},
					{
						size: "lg",
						hasError: true,
						props: { className: "ring-2" },
					},
				],
			});

			render(<Input data-testid="input" size="lg" hasError disabled={false} />);

			const input = screen.getByTestId("input");
			expect(input).toHaveClass("ring-red-500");
			expect(input).toHaveClass("ring-2");
		});

		it("should handle compound with 3+ conditions", () => {
			const Button = styled("button", {
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
					rounded: {
						true: { className: "rounded-full" },
						false: { className: "rounded-md" },
					},
					disabled: {
						true: { className: "disabled" },
						false: {},
					},
				},
				compoundVariants: [
					{
						variant: "primary",
						size: "lg",
						rounded: true,
						disabled: false,
						props: { className: "special-primary-lg-rounded" },
					},
				],
			});

			// Should match - all 4 conditions met
			render(
				<Button
					data-testid="btn1"
					variant="primary"
					size="lg"
					rounded
					disabled={false}
				/>,
			);
			expect(screen.getByTestId("btn1")).toHaveClass(
				"special-primary-lg-rounded",
			);

			// Should NOT match - one condition different
			render(
				<Button
					data-testid="btn2"
					variant="secondary"
					size="lg"
					rounded
					disabled={false}
				/>,
			);
			expect(screen.getByTestId("btn2")).not.toHaveClass(
				"special-primary-lg-rounded",
			);
		});

		it("should NOT apply compound when one condition is undefined", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
					size: {
						sm: { className: "btn-sm" },
						lg: { className: "btn-lg" },
					},
				},
				compoundVariants: [
					{
						variant: "primary",
						size: "lg",
						props: { className: "compound-class" },
					},
				],
			});

			// size is not provided, so compound should not apply
			render(<Button data-testid="btn" variant="primary" />);

			const button = screen.getByTestId("btn");
			expect(button).not.toHaveClass("compound-class");
		});
	});

	describe("advanced props merging", () => {
		it("should compose multiple onClick handlers in correct order", () => {
			const callOrder: string[] = [];

			const Button = styled("button", {
				base: {
					className: "btn",
					onClick: () => callOrder.push("base"),
				},
				variants: {
					variant: {
						primary: {
							className: "btn-primary",
							onClick: () => callOrder.push("variant"),
						},
					},
				},
				compoundVariants: [
					{
						variant: "primary",
						props: {
							className: "compound",
							onClick: () => callOrder.push("compound"),
						},
					},
				],
			});

			render(
				<Button
					data-testid="btn"
					variant="primary"
					onClick={() => callOrder.push("prop")}
				/>,
			);

			fireEvent.click(screen.getByTestId("btn"));

			// All handlers should be called in order: base → variant → compound → prop
			expect(callOrder).toEqual(["base", "variant", "compound", "prop"]);
		});

		it("should deep merge style objects (base → variant → compound → prop)", () => {
			const Button = styled("button", {
				base: {
					style: { backgroundColor: "blue", padding: "10px" },
				},
				variants: {
					size: {
						lg: { style: { padding: "20px", fontSize: "18px" } },
					},
				},
				compoundVariants: [
					{
						size: "lg",
						props: { style: { fontWeight: "bold" } },
					},
				],
			});

			render(
				<Button
					data-testid="btn"
					size="lg"
					style={{ color: "white", padding: "30px" }}
				/>,
			);

			const button = screen.getByTestId("btn");
			// Final padding should be from prop (30px) - last one wins
			expect(button).toHaveStyle({ padding: "30px" });
			// backgroundColor from base should persist
			expect(button).toHaveStyle({ backgroundColor: "blue" });
			// fontSize from variant should persist
			expect(button).toHaveStyle({ fontSize: "18px" });
			// fontWeight from compound should persist
			expect(button).toHaveStyle({ fontWeight: "bold" });
			// color from prop should be applied
			expect(button).toHaveStyle({ color: "white" });
		});

		it("should handle conflicting tailwind classes via twMerge", () => {
			const Button = styled("button", {
				base: { className: "p-4 text-sm bg-blue-500" },
				variants: {
					size: {
						lg: { className: "p-8 text-lg" },
					},
				},
			});

			render(<Button data-testid="btn" size="lg" className="p-12" />);

			const button = screen.getByTestId("btn");
			// twMerge should resolve conflicts - p-12 from prop should win
			expect(button).toHaveClass("p-12");
			expect(button).not.toHaveClass("p-4");
			expect(button).not.toHaveClass("p-8");
			// Non-conflicting classes should remain
			expect(button).toHaveClass("bg-blue-500");
			expect(button).toHaveClass("text-lg");
		});

		it("should handle empty className gracefully", () => {
			const Button = styled("button", {
				base: { className: "" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			render(<Button data-testid="btn" variant="primary" className="" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
		});

		it("should NOT pass undefined values to DOM", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			const undefinedProps = {
				title: undefined,
				"data-custom": undefined,
			};

			render(
				<Button data-testid="btn" variant="primary" {...undefinedProps} />,
			);

			const button = screen.getByTestId("btn");
			expect(button).not.toHaveAttribute("title");
			expect(button).not.toHaveAttribute("data-custom");
		});
	});

	describe("variant props filtering", () => {
		it("should handle variant named 'disabled' correctly (conflicts with HTML attr)", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					disabled: {
						true: { className: "btn-disabled", disabled: true },
						false: { className: "btn-enabled", disabled: false },
					},
				},
			});

			render(<Button data-testid="btn" disabled />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-disabled");
			expect(button).toBeDisabled();
			// 'disabled' should NOT appear as a string attribute
			expect(button.getAttribute("disabled")).toBe("");
		});

		it("should handle variant named 'type' correctly (conflicts with button type)", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					btnType: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
				},
			});

			render(<Button data-testid="btn" btnType="primary" type="submit" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
			expect(button).toHaveAttribute("type", "submit");
			expect(button).not.toHaveAttribute("btnType");
		});

		it("should pass data-* attributes to DOM regardless of variants", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			render(
				<Button
					data-testid="btn"
					data-custom="value"
					data-analytics-id="btn-123"
					variant="primary"
				/>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveAttribute("data-custom", "value");
			expect(button).toHaveAttribute("data-analytics-id", "btn-123");
		});

		it("should pass aria-* attributes to DOM regardless of variants", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			render(
				<Button
					data-testid="btn"
					aria-label="Click me"
					aria-pressed="true"
					aria-describedby="description"
					variant="primary"
				/>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveAttribute("aria-label", "Click me");
			expect(button).toHaveAttribute("aria-pressed", "true");
			expect(button).toHaveAttribute("aria-describedby", "description");
		});
	});

	describe("boolean variants edge cases", () => {
		it("should handle explicit false vs implicit false (default)", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					active: {
						true: { className: "is-active" },
						false: { className: "is-inactive" },
					},
				},
				defaultVariants: {
					active: false,
				},
			});

			// Explicit false
			render(<Button data-testid="btn1" active={false} />);
			expect(screen.getByTestId("btn1")).toHaveClass("is-inactive");

			// Implicit false (via defaultVariants)
			render(<Button data-testid="btn2" />);
			expect(screen.getByTestId("btn2")).toHaveClass("is-inactive");
		});

		it("should handle boolean variant with only 'true' defined (no 'false')", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					loading: {
						true: { className: "is-loading" },
					},
				},
			});

			render(<Button data-testid="btn1" loading />);
			expect(screen.getByTestId("btn1")).toHaveClass("is-loading");

			render(<Button data-testid="btn2" loading={false} />);
			expect(screen.getByTestId("btn2")).not.toHaveClass("is-loading");

			render(<Button data-testid="btn3" />);
			expect(screen.getByTestId("btn3")).not.toHaveClass("is-loading");
		});

		it("should handle boolean variant with only 'false' defined (no 'true')", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					visible: {
						false: { className: "hidden" },
					},
				},
			});

			render(<Button data-testid="btn1" visible={false} />);
			expect(screen.getByTestId("btn1")).toHaveClass("hidden");

			render(<Button data-testid="btn2" visible />);
			expect(screen.getByTestId("btn2")).not.toHaveClass("hidden");
		});
	});

	describe("default variants precedence with context", () => {
		it("context variant should override defaultVariant", () => {
			const ButtonContext = createStyledContext({
				variant: ["primary", "secondary"],
			});

			const Button = styled("button", {
				context: ButtonContext,
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

			// Parent provides context - must have variants to recognize variant prop
			const Parent = styled("div", {
				context: ButtonContext,
				base: { className: "parent" },
				variants: {
					variant: {
						primary: { className: "parent-primary" },
						secondary: { className: "parent-secondary" },
					},
				},
			});

			render(
				<Parent variant="secondary">
					<Button data-testid="btn" />
				</Parent>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-secondary");
			expect(button).not.toHaveClass("btn-primary");
		});

		it("prop variant should override context variant", () => {
			const ButtonContext = createStyledContext({
				variant: ["primary", "secondary", "tertiary"],
			});

			const Button = styled("button", {
				context: ButtonContext,
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
						tertiary: { className: "btn-tertiary" },
					},
				},
				defaultVariants: {
					variant: "primary",
				},
			});

			// Parent must have variants to create Provider
			const Parent = styled("div", {
				context: ButtonContext,
				base: { className: "parent" },
				variants: {
					variant: {
						primary: {},
						secondary: {},
						tertiary: {},
					},
				},
			});

			render(
				<Parent variant="secondary">
					<Button data-testid="btn" variant="tertiary" />
				</Parent>,
			);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-tertiary");
			expect(button).not.toHaveClass("btn-secondary");
			expect(button).not.toHaveClass("btn-primary");
		});

		it("should handle partial defaultVariants (some variants without defaults)", () => {
			const Button = styled("button", {
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
					rounded: {
						true: { className: "rounded-full" },
						false: { className: "rounded-none" },
					},
				},
				defaultVariants: {
					variant: "primary",
					// size and rounded have no defaults
				},
			});

			render(<Button data-testid="btn" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn-primary");
			// Size classes should not be applied
			expect(button).not.toHaveClass("btn-sm");
			expect(button).not.toHaveClass("btn-md");
			expect(button).not.toHaveClass("btn-lg");
			// Rounded classes should not be applied
			expect(button).not.toHaveClass("rounded-full");
			expect(button).not.toHaveClass("rounded-none");
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle empty variants config", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {},
			});

			render(<Button data-testid="btn" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn");
		});

		it("should handle component with no config", () => {
			const Button = styled("button", {});

			render(<Button data-testid="btn" className="custom" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("custom");
		});

		it("should silently ignore unknown variant values", () => {
			const Button = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
					},
				},
			});

			// @ts-expect-error - testing invalid variant value
			render(<Button data-testid="btn" variant="unknown" />);

			const button = screen.getByTestId("btn");
			expect(button).toHaveClass("btn");
			expect(button).not.toHaveClass("btn-primary");
		});

		it("should handle single-value variants", () => {
			const Badge = styled("span", {
				base: { className: "badge" },
				variants: {
					type: {
						new: { className: "badge-new" },
					},
				},
			});

			render(<Badge data-testid="badge" type="new" />);

			const badge = screen.getByTestId("badge");
			expect(badge).toHaveClass("badge-new");
		});

		it("should handle 10+ variants in single component", () => {
			const ComplexComponent = styled("div", {
				base: { className: "complex" },
				variants: {
					v1: { a: { className: "v1-a" }, b: { className: "v1-b" } },
					v2: { a: { className: "v2-a" }, b: { className: "v2-b" } },
					v3: { a: { className: "v3-a" }, b: { className: "v3-b" } },
					v4: { a: { className: "v4-a" }, b: { className: "v4-b" } },
					v5: { a: { className: "v5-a" }, b: { className: "v5-b" } },
					v6: { a: { className: "v6-a" }, b: { className: "v6-b" } },
					v7: { a: { className: "v7-a" }, b: { className: "v7-b" } },
					v8: { a: { className: "v8-a" }, b: { className: "v8-b" } },
					v9: { a: { className: "v9-a" }, b: { className: "v9-b" } },
					v10: { a: { className: "v10-a" }, b: { className: "v10-b" } },
				},
			});

			render(
				<ComplexComponent
					data-testid="complex"
					v1="a"
					v2="b"
					v3="a"
					v4="b"
					v5="a"
					v6="b"
					v7="a"
					v8="b"
					v9="a"
					v10="b"
				/>,
			);

			const el = screen.getByTestId("complex");
			expect(el).toHaveClass("v1-a");
			expect(el).toHaveClass("v2-b");
			expect(el).toHaveClass("v3-a");
			expect(el).toHaveClass("v4-b");
			expect(el).toHaveClass("v5-a");
			expect(el).toHaveClass("v6-b");
			expect(el).toHaveClass("v7-a");
			expect(el).toHaveClass("v8-b");
			expect(el).toHaveClass("v9-a");
			expect(el).toHaveClass("v10-b");
		});
	});
});
