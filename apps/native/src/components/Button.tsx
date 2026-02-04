import { createStyledContext, styled, withSlots } from "better-styled";
import type { ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
} from "react-native";
// import { haptics } from "./haptics";
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
		variant: {
			solid: { className: "bg-accent" },
			bordered: { className: "bg-default" },
			// bordered2: { className: "bg-default" },
		},
		test: {
			one: { className: "bg-accent" },
			two: { className: "bg-accent" },
		},
	},
	defaultVariants: {
		// variant: "bordered",
		// test: "one",
	},
});

const ButtonIndicator = styled(ActivityIndicator, {
	context: ButtonContext, // passei o context!
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
	defaultVariants: {},
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
