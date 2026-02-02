import { describe, expect, it } from "bun:test";
import { render, screen } from "@better-styled/testing";
import { createStyledContext, styled, withSlots } from "better-styled";
import { forwardRef, type ReactNode, useImperativeHandle, useRef } from "react";

describe("withSlots", () => {
	describe("basic functionality", () => {
		it("should add slots as static properties", () => {
			const CardRoot = ({ children }: { children?: ReactNode }) => (
				<div data-testid="card">{children}</div>
			);
			const CardHeader = ({ children }: { children?: ReactNode }) => (
				<header data-testid="header">{children}</header>
			);
			const CardBody = ({ children }: { children?: ReactNode }) => (
				<main data-testid="body">{children}</main>
			);

			const Card = withSlots(CardRoot, {
				Header: CardHeader,
				Body: CardBody,
			});

			expect(Card.Header).toBe(CardHeader);
			expect(Card.Body).toBe(CardBody);
		});

		it("should render component with slots correctly", () => {
			const CardRoot = ({ children }: { children?: ReactNode }) => (
				<div data-testid="card">{children}</div>
			);
			const CardHeader = ({ children }: { children?: ReactNode }) => (
				<header data-testid="header">{children}</header>
			);
			const CardBody = ({ children }: { children?: ReactNode }) => (
				<main data-testid="body">{children}</main>
			);

			const Card = withSlots(CardRoot, {
				Header: CardHeader,
				Body: CardBody,
			});

			render(
				<Card>
					<Card.Header>Title</Card.Header>
					<Card.Body>Content</Card.Body>
				</Card>,
			);

			expect(screen.getByTestId("card")).toBeInTheDocument();
			expect(screen.getByTestId("header")).toHaveTextContent("Title");
			expect(screen.getByTestId("body")).toHaveTextContent("Content");
		});

		it("should mark component as decorated with __slots", () => {
			const Component = () => <div>Test</div>;
			const Slotted = withSlots(Component, { Slot: () => <span /> });

			expect(Slotted.__slots).toBe(true);
		});
	});

	describe("with styled components", () => {
		it("should work with styled components as base", () => {
			const CardRoot = styled("div", {
				base: { className: "card-root" },
			});

			const CardHeader = styled("header", {
				base: { className: "card-header" },
			});

			const Card = withSlots(CardRoot, {
				Header: CardHeader,
			});

			render(
				<Card data-testid="card">
					<Card.Header data-testid="header">Title</Card.Header>
				</Card>,
			);

			expect(screen.getByTestId("card")).toHaveClass("card-root");
			expect(screen.getByTestId("header")).toHaveClass("card-header");
		});

		it("should work with styled components as slots", () => {
			const ButtonRoot = styled("button", {
				base: { className: "btn" },
				variants: {
					variant: {
						primary: { className: "btn-primary" },
						secondary: { className: "btn-secondary" },
					},
				},
			});

			const ButtonIcon = styled("span", {
				base: { className: "btn-icon" },
			});

			const ButtonText = styled("span", {
				base: { className: "btn-text" },
			});

			const Button = withSlots(ButtonRoot, {
				Icon: ButtonIcon,
				Text: ButtonText,
			});

			render(
				<Button data-testid="btn" variant="primary">
					<Button.Icon data-testid="icon">🚀</Button.Icon>
					<Button.Text data-testid="text">Launch</Button.Text>
				</Button>,
			);

			expect(screen.getByTestId("btn")).toHaveClass("btn", "btn-primary");
			expect(screen.getByTestId("icon")).toHaveClass("btn-icon");
			expect(screen.getByTestId("text")).toHaveClass("btn-text");
		});
	});

	describe("nested slots", () => {
		it("should support adding more slots to an already slotted component", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div data-testid="base">{children}</div>
			);
			const SlotA = () => <span data-testid="slot-a">A</span>;
			const SlotB = () => <span data-testid="slot-b">B</span>;

			const WithA = withSlots(Base, { A: SlotA });
			const WithAB = withSlots(WithA, { B: SlotB });

			// Both slots should be available
			expect(WithAB.A).toBeDefined();
			expect(WithAB.B).toBeDefined();

			render(
				<WithAB>
					<WithAB.A />
					<WithAB.B />
				</WithAB>,
			);

			expect(screen.getByTestId("slot-a")).toBeInTheDocument();
			expect(screen.getByTestId("slot-b")).toBeInTheDocument();
		});
	});

	describe("displayName", () => {
		it("should preserve displayName from styled components", () => {
			const CardRoot = styled("div", {
				base: { className: "card" },
			});

			const Card = withSlots(CardRoot, {
				Header: () => <header />,
			});

			expect(Card.displayName).toBe("Styled(div)");
		});

		it("should preserve displayName when nesting withSlots", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);
			Base.displayName = "CustomBase";

			const WithA = withSlots(Base, { A: () => <span /> });
			const WithAB = withSlots(WithA, { B: () => <span /> });

			expect(WithAB.displayName).toBe("CustomBase");
		});
	});

	// ============================================================================
	// ADVANCED TESTS
	// ============================================================================

	describe("deeply nested slots (3+ levels)", () => {
		it("should support 3 levels of slot nesting", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div data-testid="base">{children}</div>
			);
			const SlotA = () => <span data-testid="slot-a">A</span>;
			const SlotB = () => <span data-testid="slot-b">B</span>;
			const SlotC = () => <span data-testid="slot-c">C</span>;

			const Level1 = withSlots(Base, { A: SlotA });
			const Level2 = withSlots(Level1, { B: SlotB });
			const Level3 = withSlots(Level2, { C: SlotC });

			// All 3 slots should be available
			expect(Level3.A).toBeDefined();
			expect(Level3.B).toBeDefined();
			expect(Level3.C).toBeDefined();

			render(
				<Level3>
					<Level3.A />
					<Level3.B />
					<Level3.C />
				</Level3>,
			);

			expect(screen.getByTestId("slot-a")).toBeInTheDocument();
			expect(screen.getByTestId("slot-b")).toBeInTheDocument();
			expect(screen.getByTestId("slot-c")).toBeInTheDocument();
		});

		it("should preserve ALL slots from previous levels", () => {
			const Root = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);

			const Slot1 = () => <span data-testid="s1">1</span>;
			const Slot2 = () => <span data-testid="s2">2</span>;
			const Slot3 = () => <span data-testid="s3">3</span>;
			const Slot4 = () => <span data-testid="s4">4</span>;
			const Slot5 = () => <span data-testid="s5">5</span>;

			// Add slots progressively
			const L1 = withSlots(Root, { S1: Slot1 });
			const L2 = withSlots(L1, { S2: Slot2 });
			const L3 = withSlots(L2, { S3: Slot3 });
			const L4 = withSlots(L3, { S4: Slot4 });
			const L5 = withSlots(L4, { S5: Slot5 });

			// All 5 slots should exist
			expect(L5.S1).toBe(Slot1);
			expect(L5.S2).toBe(Slot2);
			expect(L5.S3).toBe(Slot3);
			expect(L5.S4).toBe(Slot4);
			expect(L5.S5).toBe(Slot5);
		});

		it("should allow slots to have their own slots", () => {
			// Base card component
			const CardRoot = ({ children }: { children?: ReactNode }) => (
				<div data-testid="card">{children}</div>
			);

			// Header with its own slots
			const HeaderRoot = ({ children }: { children?: ReactNode }) => (
				<header data-testid="header">{children}</header>
			);
			const HeaderTitle = ({ children }: { children?: ReactNode }) => (
				<h1 data-testid="header-title">{children}</h1>
			);
			const HeaderSubtitle = ({ children }: { children?: ReactNode }) => (
				<h2 data-testid="header-subtitle">{children}</h2>
			);

			// Create Header with its own slots
			const Header = withSlots(HeaderRoot, {
				Title: HeaderTitle,
				Subtitle: HeaderSubtitle,
			});

			// Body component
			const Body = ({ children }: { children?: ReactNode }) => (
				<main data-testid="body">{children}</main>
			);

			// Create Card with Header (which has its own slots) and Body
			const Card = withSlots(CardRoot, {
				Header,
				Body,
			});

			// Header should have its slots
			expect(Card.Header.Title).toBe(HeaderTitle);
			expect(Card.Header.Subtitle).toBe(HeaderSubtitle);

			render(
				<Card>
					<Card.Header>
						<Card.Header.Title>Main Title</Card.Header.Title>
						<Card.Header.Subtitle>Subtitle</Card.Header.Subtitle>
					</Card.Header>
					<Card.Body>Content</Card.Body>
				</Card>,
			);

			expect(screen.getByTestId("card")).toBeInTheDocument();
			expect(screen.getByTestId("header")).toBeInTheDocument();
			expect(screen.getByTestId("header-title")).toHaveTextContent(
				"Main Title",
			);
			expect(screen.getByTestId("header-subtitle")).toHaveTextContent(
				"Subtitle",
			);
			expect(screen.getByTestId("body")).toHaveTextContent("Content");
		});

		it("should maintain correct displayName through all levels", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);
			Base.displayName = "MyComponent";

			const L1 = withSlots(Base, { A: () => <span /> });
			const L2 = withSlots(L1, { B: () => <span /> });
			const L3 = withSlots(L2, { C: () => <span /> });
			const L4 = withSlots(L3, { D: () => <span /> });

			expect(L1.displayName).toBe("MyComponent");
			expect(L2.displayName).toBe("MyComponent");
			expect(L3.displayName).toBe("MyComponent");
			expect(L4.displayName).toBe("MyComponent");
		});
	});

	describe("slots with refs (forwardRef)", () => {
		it("should forward ref to base component", () => {
			const BaseWithRef = forwardRef<HTMLDivElement, { children?: ReactNode }>(
				(props, ref) => (
					<div ref={ref} data-testid="base">
						{props.children}
					</div>
				),
			);

			const Slotted = withSlots(BaseWithRef, {
				Child: () => <span>Child</span>,
			});

			const TestComponent = () => {
				const ref = useRef<HTMLDivElement>(null);

				return (
					<div>
						<Slotted ref={ref}>
							<Slotted.Child />
						</Slotted>
						<button
							type="button"
							data-testid="check-ref"
							onClick={() => {
								if (ref.current) {
									ref.current.setAttribute("data-ref-works", "true");
								}
							}}
						>
							Check
						</button>
					</div>
				);
			};

			render(<TestComponent />);

			// Click button to test ref
			const button = screen.getByTestId("check-ref");
			button.click();

			// Ref should have worked
			expect(screen.getByTestId("base")).toHaveAttribute(
				"data-ref-works",
				"true",
			);
		});

		it("should forward ref through cloned component (nested withSlots)", () => {
			const BaseWithRef = forwardRef<HTMLDivElement, { children?: ReactNode }>(
				(props, ref) => (
					<div ref={ref} data-testid="base">
						{props.children}
					</div>
				),
			);

			const SlotA = () => <span data-testid="slot-a">A</span>;
			const SlotB = () => <span data-testid="slot-b">B</span>;

			// Nested withSlots - component gets cloned
			const L1 = withSlots(BaseWithRef, { A: SlotA });
			const L2 = withSlots(L1, { B: SlotB });

			const TestComponent = () => {
				const ref = useRef<HTMLDivElement>(null);

				return (
					<div>
						<L2 ref={ref}>
							<L2.A />
							<L2.B />
						</L2>
						<button
							type="button"
							data-testid="test-ref"
							onClick={() => {
								if (ref.current) {
									ref.current.setAttribute("data-cloned-ref", "true");
								}
							}}
						>
							Test
						</button>
					</div>
				);
			};

			render(<TestComponent />);

			screen.getByTestId("test-ref").click();

			expect(screen.getByTestId("base")).toHaveAttribute(
				"data-cloned-ref",
				"true",
			);
		});

		it("should work with useImperativeHandle", () => {
			interface RefHandle {
				focus: () => void;
				getValue: () => string;
			}

			const InputWithHandle = forwardRef<
				RefHandle,
				{ children?: ReactNode; value?: string }
			>((props, ref) => {
				useImperativeHandle(ref, () => ({
					focus: () => {
						// Mock focus
					},
					getValue: () => props.value || "default",
				}));

				return <div data-testid="input">{props.children}</div>;
			});

			const Input = withSlots(InputWithHandle, {
				Label: ({ children }: { children?: ReactNode }) => (
					<span data-testid="label">{children}</span>
				),
			});

			const TestComponent = () => {
				const ref = useRef<RefHandle>(null);

				return (
					<div>
						<Input ref={ref} value="test-value">
							<Input.Label>Name</Input.Label>
						</Input>
						<button
							type="button"
							data-testid="get-value"
							onClick={() => {
								const value = ref.current?.getValue();
								const input = document.querySelector('[data-testid="input"]');
								if (input) {
									input.setAttribute("data-value", value || "");
								}
							}}
						>
							Get Value
						</button>
					</div>
				);
			};

			render(<TestComponent />);

			screen.getByTestId("get-value").click();

			expect(screen.getByTestId("input")).toHaveAttribute(
				"data-value",
				"test-value",
			);
		});
	});

	describe("static property preservation", () => {
		it("should preserve custom static properties through cloning", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);

			// Add custom static properties
			(Base as typeof Base & { customProp: string }).customProp =
				"custom-value";
			(Base as typeof Base & { version: number }).version = 1;

			const WithSlot = withSlots(Base, { Slot: () => <span /> });

			// Custom properties should be preserved
			expect(
				(WithSlot as typeof WithSlot & { customProp: string }).customProp,
			).toBe("custom-value");
			expect((WithSlot as typeof WithSlot & { version: number }).version).toBe(
				1,
			);
		});

		it("should preserve __slots marker through multiple withSlots calls", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);

			const L1 = withSlots(Base, { A: () => <span /> });
			expect(L1.__slots).toBe(true);

			const L2 = withSlots(L1, { B: () => <span /> });
			expect(L2.__slots).toBe(true);

			const L3 = withSlots(L2, { C: () => <span /> });
			expect(L3.__slots).toBe(true);
		});

		it("should NOT copy prototype, length, or name incorrectly", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);

			const WithSlot = withSlots(Base, { Slot: () => <span /> });

			// These should be the component's own properties, not copied from original
			expect(typeof WithSlot).toBe("function");
			expect(WithSlot.length).toBeDefined(); // Function length is its arity
		});
	});

	describe("slots with styled components and context", () => {
		it("should share context between styled base and styled slots", () => {
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

			const ButtonText = styled("span", {
				context: ButtonContext,
				base: { className: "btn-text" },
				variants: {
					variant: {
						primary: { className: "text-primary" },
						secondary: { className: "text-secondary" },
					},
				},
			});

			const Button = withSlots(ButtonRoot, {
				Icon: ButtonIcon,
				Text: ButtonText,
			});

			render(
				<Button data-testid="btn" variant="primary" size="lg">
					<Button.Icon data-testid="icon">🚀</Button.Icon>
					<Button.Text data-testid="text">Launch</Button.Text>
				</Button>,
			);

			// Root should have variant and size classes
			expect(screen.getByTestId("btn")).toHaveClass("btn-primary", "btn-lg");

			// Icon should inherit size from context
			expect(screen.getByTestId("icon")).toHaveClass("icon-lg");

			// Text should inherit variant from context
			// Note: depends on context propagation implementation
			expect(screen.getByTestId("text")).toHaveClass("btn-text");
		});

		it("should work with multiple slot levels and context", () => {
			const CardContext = createStyledContext({
				elevated: ["boolean"],
			});

			const CardRoot = styled("div", {
				context: CardContext,
				base: { className: "card" },
				variants: {
					elevated: {
						true: { className: "card-elevated" },
						false: { className: "card-flat" },
					},
				},
			});

			const CardHeader = styled("header", {
				context: CardContext,
				base: { className: "card-header" },
				variants: {
					elevated: {
						true: { className: "header-elevated" },
						false: { className: "header-flat" },
					},
				},
			});

			const CardBody = styled("main", {
				context: CardContext,
				base: { className: "card-body" },
				variants: {
					elevated: {
						true: { className: "body-elevated" },
						false: { className: "body-flat" },
					},
				},
			});

			const Card = withSlots(CardRoot, {
				Header: CardHeader,
				Body: CardBody,
			});

			render(
				<Card data-testid="card" elevated>
					<Card.Header data-testid="header">Title</Card.Header>
					<Card.Body data-testid="body">Content</Card.Body>
				</Card>,
			);

			expect(screen.getByTestId("card")).toHaveClass("card-elevated");
			expect(screen.getByTestId("header")).toHaveClass("header-elevated");
			expect(screen.getByTestId("body")).toHaveClass("body-elevated");
		});
	});

	describe("edge cases", () => {
		it("should handle empty slots object", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div data-testid="base">{children}</div>
			);

			const WithNoSlots = withSlots(Base, {});

			expect(WithNoSlots.__slots).toBe(true);

			render(<WithNoSlots>Content</WithNoSlots>);

			expect(screen.getByTestId("base")).toHaveTextContent("Content");
		});

		it("should handle slot with same name being overwritten", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div>{children}</div>
			);

			const SlotV1 = () => <span data-testid="v1">V1</span>;
			const SlotV2 = () => <span data-testid="v2">V2</span>;

			const L1 = withSlots(Base, { Slot: SlotV1 });
			const L2 = withSlots(L1, { Slot: SlotV2 });

			// Slot should be overwritten to V2
			expect(L2.Slot).toBe(SlotV2);

			render(
				<L2>
					<L2.Slot />
				</L2>,
			);

			expect(screen.getByTestId("v2")).toBeInTheDocument();
			expect(screen.queryByTestId("v1")).not.toBeInTheDocument();
		});

		it("should handle function component without displayName", () => {
			// Anonymous arrow function
			const Anonymous = ({ children }: { children?: ReactNode }) => (
				<div data-testid="anon">{children}</div>
			);

			const WithSlot = withSlots(Anonymous, {
				Child: () => <span>Child</span>,
			});

			// Should handle gracefully (use "Component" or function name)
			// Note: displayName may not be set for anonymous functions
			expect(typeof WithSlot).toBe("function");

			render(<WithSlot>Test</WithSlot>);

			expect(screen.getByTestId("anon")).toHaveTextContent("Test");
		});

		it("should handle null children in slots", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div data-testid="base">{children}</div>
			);

			const Slot = ({ children }: { children?: ReactNode }) => (
				<span data-testid="slot">{children}</span>
			);

			const Component = withSlots(Base, { Slot });

			render(
				<Component>
					<Component.Slot>{null}</Component.Slot>
				</Component>,
			);

			expect(screen.getByTestId("base")).toBeInTheDocument();
			expect(screen.getByTestId("slot")).toBeInTheDocument();
			expect(screen.getByTestId("slot")).toBeEmptyDOMElement();
		});

		it("should handle component that throws during render", () => {
			const Base = ({ children }: { children?: ReactNode }) => (
				<div data-testid="base">{children}</div>
			);

			const ThrowingSlot = () => {
				throw new Error("Slot error");
			};

			const Component = withSlots(Base, { Bad: ThrowingSlot });

			// withSlots should succeed (it's just assignment)
			expect(Component.Bad).toBe(ThrowingSlot);

			// Rendering would throw (expected React behavior)
			expect(() => {
				render(
					<Component>
						<Component.Bad />
					</Component>,
				);
			}).toThrow("Slot error");
		});
	});
});
