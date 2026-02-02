/**
 * Component that can be decorated with slots
 */
export type DecoratedComponent = Function & { __slots?: boolean };

/**
 * Slot props mapping
 */
export type SlotProps = Record<string, unknown>;

/**
 * Result of withSlots - component with slots as static properties
 * Includes __slots marker to indicate the component has been decorated
 */
export type WithSlotsResult<
	C extends DecoratedComponent,
	S extends SlotProps,
> = C & S & { __slots: true };
