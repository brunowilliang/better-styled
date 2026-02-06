import {
	createStyledContext,
	styled,
	styledConfig,
	withSlots,
} from "better-styled";
import { Image as ExpoImage, ImageBackground } from "expo-image";
import { withUniwind } from "uniwind";

const UniwindImage = withUniwind(ExpoImage);
const UniwindImageBg = withUniwind(ImageBackground);

const ImageCtx = createStyledContext({
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

const config = styledConfig([UniwindImage, UniwindImageBg], {
	context: ImageCtx,
	base: {},
	variants: {
		variant: {
			danger: { onBlur: () => {} },
		},
		isDisabled: {
			true: { className: "bg-red-500" },
		},
	},
	defaultVariants: {},
});

const ExpoImageBase = styled(UniwindImage, config);
const ImageBackgroundBase = styled(UniwindImageBg, config);

export const Image = withSlots(ExpoImageBase, {
	Background: ImageBackgroundBase,
});
