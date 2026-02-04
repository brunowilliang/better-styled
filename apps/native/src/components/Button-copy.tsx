import { createStyledContext, styled, withSlots } from "better-styled";
import { Pressable, Text } from "react-native";
import Animated from "react-native-reanimated";
import { withUniwind } from "uniwind";

export const TextBase = styled(Text, {
	base: {
		className: "text-foreground font-normal",
		allowFontScaling: false,
		adjustsFontSizeToFit: false,
		maxFontSizeMultiplier: 1.5,
		minimumFontScale: 0.5,
	},
	variants: {
		variant: {
			display: { className: "text-4xl font-bold tracking-tight" },
			heading: { className: "text-2xl font-semibold" },
			title: { className: "text-xl font-semibold" },
			body: { className: "text-base" },
			caption: { className: "text-sm" },
			label: { className: "text-xs font-medium uppercase tracking-wide" },
		},
		size: {
			xs: { className: "text-xs" },
			sm: { className: "text-sm" },
			base: { className: "text-base" },
			lg: { className: "text-lg" },
			xl: { className: "text-xl" },
			"2xl": { className: "text-2xl" },
			"3xl": { className: "text-3xl" },
			"4xl": { className: "text-4xl" },
		},
		weight: {
			light: { className: "font-light" },
			normal: { className: "font-normal" },
			medium: { className: "font-medium" },
			semibold: { className: "font-semibold" },
			bold: { className: "font-bold" },
		},
		color: {
			foreground: { className: "text-foreground" },
			muted: { className: "text-muted" },
			accent: { className: "text-accent" },
			success: { className: "text-success" },
			warning: { className: "text-warning" },
			danger: { className: "text-danger" },
		},
	},
	defaultVariants: {
		variant: "body",
		color: "foreground",
	},
});

export const TextBaseAnimated = styled(withUniwind(Animated.Text), {
	base: {
		className: "text-foreground font-normal",
		allowFontScaling: false,
		adjustsFontSizeToFit: false,
		maxFontSizeMultiplier: 1.5,
		minimumFontScale: 0.5,
	},
	variants: {
		variant: {
			display: { className: "text-4xl font-bold tracking-tight" },
			heading: { className: "text-2xl font-semibold" },
			title: { className: "text-xl font-semibold" },
			body: { className: "text-base" },
			caption: { className: "text-sm" },
			label: { className: "text-xs font-medium uppercase tracking-wide" },
		},
		size: {
			xs: { className: "text-xs" },
			sm: { className: "text-sm" },
			base: { className: "text-base" },
			lg: { className: "text-lg" },
			xl: { className: "text-xl" },
			"2xl": { className: "text-2xl" },
			"3xl": { className: "text-3xl" },
			"4xl": { className: "text-4xl" },
		},
		weight: {
			light: { className: "font-light" },
			normal: { className: "font-normal" },
			medium: { className: "font-medium" },
			semibold: { className: "font-semibold" },
			bold: { className: "font-bold" },
		},
		color: {
			foreground: { className: "text-foreground" },
			muted: { className: "text-muted" },
			accent: { className: "text-accent" },
			success: { className: "text-success" },
			warning: { className: "text-warning" },
			danger: { className: "text-danger" },
		},
	},
	defaultVariants: {
		variant: "body",
		color: "foreground",
	},
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

const ButtonRoot = styled(Pressable, {
	context: ButtonCtx,
	base: {
		className: "flex-row centered",
	},
	// variant: {
	// 	variant: {
	// 		variant: {
	// 			primary: { className: "bg-accent" },
	// 			secondary: { className: "bg-default" },
	// 			tertiary: { className: "bg-default" },
	// 			ghost: { className: "bg-transparent" },
	// 			danger: { className: "bg-danger" },
	// 			"danger-soft": { className: "bg-danger/20" },
	// 		},
	// 		primary: { className: "bg-accent" },
	// 		secondary: { className: "bg-default" },
	// 		tertiary: { className: "bg-default" },
	// 		ghost: { className: "bg-transparent" },
	// 		danger: { className: "bg-danger" },
	// 		"danger-soft": { className: "bg-danger/20" },
	// 	},
	variants: {
		variant: {
			primary: { className: "bg-accent" },
			secondary: { className: "bg-default" },
			tertiary: { className: "bg-default" },
			ghost: { className: "bg-transparent" },
			danger: { className: "bg-danger" },
			"danger-soft": { className: "bg-danger/20" },
		},
		size: {
			sm: { className: "h-9 px-3.5 gap-1 rounded-2xl" },
			md: { className: "h-12 px-4 gap-1.5 rounded-3xl" },
			lg: { className: "h-14 gap-1.5 rounded-4xl px-5" },
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
		size: "md",
	},
});

const ButtonLabelRoot = styled(TextBase, {
	context: ButtonCtx,
	base: {
		className: "font-semibold",
	},
	variants: {
		variant: {
			primary: { className: "text-accent-foreground" },
			secondary: { className: "text-accent" },
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
	Text: withSlots(TextBase, {
		Animated: TextBaseAnimated,
	}),
});

// exemplo de uso
export const Exemple = () => {
	const variants = [
		"primary",
		"secondary",
		"tertiary",
		"ghost",
		"danger",
		"danger-soft",
	] as const;

	return (
		<>
			{/* exemplo 1 */}
			{variants.map((variant) => (
				<Button key={variant} variant={variant}>
					<Button.Label>{variant}</Button.Label>
					<Button.Text>{variant}</Button.Text>
					<Button.Text.Animated>{variant}</Button.Text.Animated>
				</Button>
			))}

			{/* exemplo 2 */}
			<Button>
				<Button.Label>Hello</Button.Label>
				<Button.Text>Hello</Button.Text>
				<Button.Text.Animated>Hello</Button.Text.Animated>
			</Button>
		</>
	);
};
