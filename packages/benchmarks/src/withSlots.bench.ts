/**
 * Benchmarks for withSlots()
 *
 * Tests performance of:
 * - Slot attachment with varying counts
 * - Nested withSlots calls
 * - Component cloning overhead
 * - Static property preservation
 */

import { styled, withSlots } from "better-styled";
import { bench, group, run } from "mitata";
import { createElement, forwardRef } from "react";

// =============================================================================
// Setup: Create base components
// =============================================================================

const BaseCard = styled("div", {
	base: { className: "card" },
});

const CardHeader = styled("header", {
	base: { className: "card-header" },
});

const CardBody = styled("div", {
	base: { className: "card-body" },
});

const CardFooter = styled("footer", {
	base: { className: "card-footer" },
});

const CardTitle = styled("h2", {
	base: { className: "card-title" },
});

const CardDescription = styled("p", {
	base: { className: "card-description" },
});

const CardActions = styled("div", {
	base: { className: "card-actions" },
});

const CardImage = styled("img", {
	base: { className: "card-image" },
});

const CardMeta = styled("span", {
	base: { className: "card-meta" },
});

const CardBadge = styled("span", {
	base: { className: "card-badge" },
});

// =============================================================================
// Setup: forwardRef components
// =============================================================================

const ForwardRefCard = forwardRef<
	HTMLDivElement,
	{ className?: string; children?: React.ReactNode }
>((props, ref) => createElement("div", { ...props, ref }));
ForwardRefCard.displayName = "ForwardRefCard";

const ForwardRefHeader = forwardRef<
	HTMLElement,
	{ className?: string; children?: React.ReactNode }
>((props, ref) => createElement("header", { ...props, ref }));
ForwardRefHeader.displayName = "ForwardRefHeader";

// =============================================================================
// Benchmarks: Slot Attachment
// =============================================================================

group("withSlots() - Slot Attachment", () => {
	bench("1 slot", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
		});
	}).baseline();

	bench("2 slots", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
		});
	});

	bench("3 slots", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
			Footer: CardFooter,
		});
	});

	bench("5 slots", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
			Footer: CardFooter,
			Title: CardTitle,
			Description: CardDescription,
		});
	});

	bench("10 slots", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
			Footer: CardFooter,
			Title: CardTitle,
			Description: CardDescription,
			Actions: CardActions,
			Image: CardImage,
			Meta: CardMeta,
			Badge: CardBadge,
			Extra: styled("div", { base: { className: "extra" } }),
		});
	});
});

// =============================================================================
// Benchmarks: Nested withSlots (cloning)
// =============================================================================

group("withSlots() - Nested Calls (Cloning)", () => {
	bench("single withSlots", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
		});
	}).baseline();

	bench("2 nested withSlots", () => {
		const Card = withSlots(BaseCard, {
			Header: CardHeader,
		});
		withSlots(Card, {
			Body: CardBody,
		});
	});

	bench("3 nested withSlots", () => {
		const Card1 = withSlots(BaseCard, {
			Header: CardHeader,
		});
		const Card2 = withSlots(Card1, {
			Body: CardBody,
		});
		withSlots(Card2, {
			Footer: CardFooter,
		});
	});

	bench("5 nested withSlots", () => {
		const Card1 = withSlots(BaseCard, { Header: CardHeader });
		const Card2 = withSlots(Card1, { Body: CardBody });
		const Card3 = withSlots(Card2, { Footer: CardFooter });
		const Card4 = withSlots(Card3, { Title: CardTitle });
		withSlots(Card4, { Description: CardDescription });
	});
});

// =============================================================================
// Benchmarks: Slots with Slots (hierarchical)
// =============================================================================

group("withSlots() - Hierarchical Slots", () => {
	bench("flat structure", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
			Body: CardBody,
			Footer: CardFooter,
		});
	}).baseline();

	bench("1 level nested (Header.Title)", () => {
		const Header = withSlots(CardHeader, {
			Title: CardTitle,
		});
		withSlots(BaseCard, {
			Header,
			Body: CardBody,
		});
	});

	bench("2 levels nested", () => {
		const Title = withSlots(CardTitle, {
			Badge: CardBadge,
		});
		const Header = withSlots(CardHeader, {
			Title,
			Meta: CardMeta,
		});
		withSlots(BaseCard, {
			Header,
			Body: CardBody,
		});
	});

	bench("complex hierarchy", () => {
		const Badge = withSlots(CardBadge, {
			Icon: styled("span", { base: { className: "icon" } }),
		});
		const Title = withSlots(CardTitle, {
			Badge,
		});
		const Header = withSlots(CardHeader, {
			Title,
			Meta: CardMeta,
			Actions: CardActions,
		});
		const Body = withSlots(CardBody, {
			Image: CardImage,
			Description: CardDescription,
		});
		withSlots(BaseCard, {
			Header,
			Body,
			Footer: CardFooter,
		});
	});
});

// =============================================================================
// Benchmarks: forwardRef with withSlots
// =============================================================================

group("withSlots() - forwardRef Components", () => {
	bench("regular component", () => {
		withSlots(BaseCard, {
			Header: CardHeader,
		});
	}).baseline();

	bench("forwardRef base component", () => {
		withSlots(ForwardRefCard, {
			Header: CardHeader,
		});
	});

	bench("forwardRef slots", () => {
		withSlots(BaseCard, {
			Header: ForwardRefHeader,
		});
	});

	bench("both forwardRef", () => {
		withSlots(ForwardRefCard, {
			Header: ForwardRefHeader,
		});
	});

	bench("nested forwardRef withSlots", () => {
		const Card1 = withSlots(ForwardRefCard, {
			Header: ForwardRefHeader,
		});
		withSlots(Card1, {
			Body: CardBody,
		});
	});
});

// =============================================================================
// Benchmarks: Render with Slots (createElement)
// =============================================================================

const Card2Slots = withSlots(BaseCard, {
	Header: CardHeader,
	Body: CardBody,
});

const Card5Slots = withSlots(BaseCard, {
	Header: CardHeader,
	Body: CardBody,
	Footer: CardFooter,
	Title: CardTitle,
	Description: CardDescription,
});

const Card10Slots = withSlots(BaseCard, {
	Header: CardHeader,
	Body: CardBody,
	Footer: CardFooter,
	Title: CardTitle,
	Description: CardDescription,
	Actions: CardActions,
	Image: CardImage,
	Meta: CardMeta,
	Badge: CardBadge,
	Extra: styled("div", { base: { className: "extra" } }),
});

group("withSlots() - Render Performance", () => {
	bench("base component (no slots)", () => {
		createElement(BaseCard, { children: "content" });
	}).baseline();

	bench("with 2 slots", () => {
		createElement(Card2Slots, { children: "content" });
	});

	bench("with 5 slots", () => {
		createElement(Card5Slots, { children: "content" });
	});

	bench("with 10 slots", () => {
		createElement(Card10Slots, { children: "content" });
	});

	bench("accessing slot component", () => {
		createElement(Card5Slots.Header, { children: "Header" });
	});

	bench("full compound render", () => {
		createElement(
			Card5Slots,
			null,
			createElement(
				Card5Slots.Header,
				null,
				createElement(Card5Slots.Title, null, "Title"),
			),
			createElement(
				Card5Slots.Body,
				null,
				createElement(Card5Slots.Description, null, "Desc"),
			),
			createElement(Card5Slots.Footer, null, "Footer"),
		);
	});
});

// =============================================================================
// Benchmarks: Static Property Access
// =============================================================================

group("withSlots() - Static Property Access", () => {
	bench("direct property access", () => {
		void Card5Slots.Header;
	}).baseline();

	bench("multiple property access", () => {
		void Card5Slots.Header;
		void Card5Slots.Body;
		void Card5Slots.Footer;
	});

	bench("all properties access", () => {
		void Card5Slots.Header;
		void Card5Slots.Body;
		void Card5Slots.Footer;
		void Card5Slots.Title;
		void Card5Slots.Description;
	});

	bench("displayName access", () => {
		void Card5Slots.displayName;
	});

	bench("__slots marker check", () => {
		void (Card5Slots as unknown as { __slots: boolean }).__slots;
	});
});

// =============================================================================
// Run all benchmarks
// =============================================================================

await run({
	colors: true,
});
