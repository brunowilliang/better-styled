import { createStyledContext, styled, withSlots } from "better-styled";
import { Pressable, Text } from "react-native";

// Create context with arrays of options
// Use ["boolean"] for boolean variants
const ButtonContext = createStyledContext({
	variant: ["primary", "secondary", "outline"],
	size: ["sm", "md", "lg"],
	disabled: ["boolean"],
});

// Styled Pressable with variants
const StyledButton = styled(Pressable, {
	context: ButtonContext,
	base: {
		className: "flex-row items-center justify-center rounded-xl",
	},
	variants: {
		variant: {
			primary: {
				onPress: () => console.log("primary onPress pressed"),
				className: "bg-red-500",
			},
			secondary: {
				className: "bg-blue-500",
			},
			outline: {
				className: "bg-transparent border border-blue-500",
			},
		},
		size: {
			sm: {
				className: "p-2",
			},
			md: {
				className: "p-4",
			},
			lg: {
				className: "p-6",
			},
		},
		disabled: {
			true: {
				disabled: true,
				className: "opacity-20",
			},
		},
	},
});

// Styled Text that inherits variants from Button context
const StyledButtonText = styled(Text, {
	context: ButtonContext,
	base: {
		className: "font-semibold",
	},
	variants: {
		variant: {
			primary: {
				className: "text-blue-500",
			},
			secondary: {
				className: "text-red-500",
			},
			outline: {
				className: "text-blue-500",
			},
		},
		size: {
			sm: {
				className: "text-sm",
			},
			md: {
				className: "text-base",
			},
			lg: {
				className: "text-lg",
			},
		},
	},
	defaultVariants: {
		variant: "outline",
		size: "sm",
	},
});

// Create a slot
export const Button = withSlots(StyledButton, {
	Label: StyledButtonText,
});
