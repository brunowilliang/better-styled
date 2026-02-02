import { styled, withSlots } from "better-styled";
import { Pressable, Text } from "react-native";

// Create context with arrays of options
// Use ["boolean"] for boolean variants
// const ButtonContext = createStyledContext({
// 	variant: ["primary", "secondary", "outline"],
// 	size: ["sm", "md", "lg"],
// 	isDisabled: ["boolean"],
// });

// Styled Pressable with variants
const StyledButton = styled(Pressable, {
	base: {
		className: "flex-row items-center justify-center rounded-xl",
	},
	variants: {
		variant: {
			primary: {
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
		isDisabled: {
			true: {
				disabled: true,
				className: "opacity-20",
			},
		},
	},
	defaultVariants: {
		variant: "primary", // OK
		size: "md", // OK
		isDisabled: true, // OK
	},
});

// Styled Text that inherits variants from Button context
const StyledButtonText = styled(Text, {
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
	},
	defaultVariants: {
		variant: "outline",
	},
});

// Create a slot
export const Button = withSlots(StyledButton, {
	Label: StyledButtonText,
});
