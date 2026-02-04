import { createStyledContext, styled, withSlots } from "better-styled";
import type { ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
} from "react-native";
import { haptics } from "./haptics";
import { Text } from "./Text";

const ButtonContext = createStyledContext({
	variant: [
		"solid",
		"bordered",
		"danger-bordered",
		"danger",
		"light",
		"flat",
		"link",
	],
});

type ButtonRootProps = PressableProps & {
	isLoading?: boolean;
	children?: ReactNode;
};

const ButtonRootComponent = (props: ButtonRootProps) => {
	return (
		<Pressable {...props} disabled={props.isLoading || props.disabled}>
			{props.children}
			{props.isLoading && <ButtonIndicator />}
		</Pressable>
	);
};

const ButtonRoot = styled(ButtonRootComponent, {
	context: ButtonContext,
	base: {
		className:
			"centered h-16 w-full flex-row gap-2 rounded-2xl transition-all duration-300 active:scale-[0.98] active:opacity-60 disabled:opacity-50",
	},
	variants: {
		haptics,
		variant: {
			solid: { className: "bg-primary" },
			bordered: { className: "border-2 border-primary bg-transparent" },
			"danger-bordered": {
				className: "border-2 border-danger bg-transparent",
			},
			danger: { className: "bg-transparent" },
			light: { className: "bg-transparent" },
			flat: { className: "bg-primary/20" },
			link: { className: "h-auto bg-transparent" },
		},
	},
	defaultVariants: {
		variant: "flat",
		haptics: "heavy",
	},
});

const ButtonIndicator = styled(ActivityIndicator, {
	context: ButtonContext,
	variants: {
		variant: {
			solid: { className: "text-surface" },
			bordered: { className: "text-primary" },
			"danger-bordered": { className: "text-danger" },
			danger: { className: "text-danger" },
			light: { className: "text-primary" },
			flat: { className: "text-primary" },
			link: { className: "text-primary" },
		},
	},
});

const ButtonText = styled(Text, {
	context: ButtonContext,
	base: { variant: "display" },
	variants: {
		variant: {
			solid: { className: "text-surface" },
			bordered: { className: "text-primary" },
			"danger-bordered": { className: "text-danger" },
			danger: { className: "text-danger" },
			light: { className: "text-primary" },
			flat: { className: "text-primary" },
			link: { className: "font-idonate-semibold text-primary" },
		},
	},
});

// const ButtonIcon = styled(Icon, {
// 	context: ButtonContext,
// 	variants: {
// 		variant: {
// 			solid: { className: "text-surface" },
// 			bordered: { className: "text-primary" },
// 			"danger-bordered": { className: "text-danger" },
// 			danger: { className: "text-danger" },
// 			light: { className: "text-primary" },
// 			flat: { className: "text-primary" },
// 			link: { className: "text-primary" },
// 		},
// 	},
// });

export const Button = withSlots(ButtonRoot, {
	Text: ButtonText,
	// Icon: ButtonIcon,
});
