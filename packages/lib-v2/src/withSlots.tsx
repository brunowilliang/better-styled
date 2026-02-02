import { type ForwardRefExoticComponent, forwardRef } from "react"
import type { DecoratedComponent, SlotProps, WithSlotsResult } from "./types/withSlots"

// WeakSet for tracking decorated components (better for GC than Symbol)
const decoratedComponents = new WeakSet<Function>();

/**
 * Adds static properties (slots) to a component.
 * Useful for compound components pattern.
 *
 * @param component - Base component to add slots to
 * @param slots - Object with slot components
 * @returns Component with slots as static properties
 *
 * @example
 * const Card = withSlots(CardBase, {
 *   Header: CardHeader,
 *   Body: CardBody,
 *   Footer: CardFooter,
 * })
 *
 * // Usage:
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card>
 */
export const withSlots = <C extends DecoratedComponent, S extends SlotProps>(
	component: C,
	slots: S,
): WithSlotsResult<C, S> => {
	let target: DecoratedComponent;

	// If already decorated, clone to avoid shared mutations
	if (decoratedComponents.has(component)) {
		const ClonedComponent = forwardRef((props, ref) => {
			return (component as Function)(props, ref);
		}) as ForwardRefExoticComponent<unknown> & DecoratedComponent;

		// Copy existing static properties
		for (const key of Object.keys(component)) {
			if (key !== "prototype" && key !== "length" && key !== "name") {
				const value = (component as Record<string, unknown>)[key];
				(ClonedComponent as unknown as Record<string, unknown>)[key] = value;
			}
		}

		// Preserve displayName
		const originalName =
			(component as { displayName?: string }).displayName ||
			component.name ||
			"Component";
		ClonedComponent.displayName = originalName;

		target = ClonedComponent;
	} else {
		target = component;
	}

	// Assign new slots
	Object.assign(target, slots);

	// Mark as decorated
	decoratedComponents.add(target);
	target.__slots = true;

	return target as WithSlotsResult<C, S>;
};
