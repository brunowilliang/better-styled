import { createStyledContext, styled, withSlots } from "better-styled";
import { createAnimatedPressable } from "pressto";
import { Text } from "react-native";
import { withUniwind } from "uniwind";

const PresstoPressable = createAnimatedPressable((progress) => {
	"worklet";

	return {
		opacity: 1 - progress * 0.3,
		transform: [{ scale: 1 - progress * 0.02 }],
	};
});

const ButtonCtx = createStyledContext({
	variant: [
		"primary",
		"secondary",
		"tertiary",
		"ghost",
		"danger",
		"danger-soft",
	],
	size: ["sm", "md", "lg"],
	isIconOnly: ["boolean"],
	isDisabled: ["boolean"],
});

const ButtonRoot = styled(withUniwind(PresstoPressable), {
	context: ButtonCtx,
	base: {
		className: "flex-row centered",
		animationType: "spring",
		animationConfig: { duration: 350 },
	},
	variants: {
		variant: {
			primary: { className: "bg-accent" },
			secondary: { className: "bg-default" },
			tertiary: { className: "bg-default" },
			ghost: { className: "bg-transparent" },
			danger: { className: "bg-danger" },
			"danger-soft": { className: "bg-danger-soft" },
		},
		size: {
			sm: { className: "h-9 px-3.5 gap-1.5 rounded-2xl" },
			md: { className: "h-12 px-4 gap-2 rounded-3xl" },
			lg: { className: "h-14 gap-2.5 rounded-4xl px-5" },
		},
		isIconOnly: {
			true: { className: "p-0 aspect-square" },
		},
		isDisabled: {
			true: { className: "opacity-disabled pointer-events-none" },
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "sm",
	},
});

const ButtonLabelRoot = styled(Text, {
	context: ButtonCtx,
	base: {
		className: "font-semibold",
	},
	variants: {
		variant: {
			primary: { className: "text-accent-foreground" },
			secondary: { className: "text-accent-soft-foreground" },
			tertiary: { className: "text-default-foreground" },
			ghost: { className: "text-default-foreground" },
			danger: { className: "text-danger-foreground" },
			"danger-soft": { className: "text-danger" },
		},
		size: {
			sm: { className: "text-sm" },
			md: { className: "text-base" },
			lg: { className: "text-lg" },
		},
	},
});

export const Button = withSlots(ButtonRoot, {
	Label: ButtonLabelRoot,
});
