import { View } from "react-native";
import { Button } from "../components/Button";

export default function App() {
	return (
		<View className="flex-1 items-center justify-center bg-white px-8 dark:bg-black">
			<Button onPress={() => console.log("Button onPress pressed")}>
				<Button.Label>Hello World</Button.Label>
			</Button>
			<Button
				isDisabled
				onPress={() => console.log("Button onPress pressed")}
				variant="primary"
				size="sm"
			>
				<Button.Label>Hello World</Button.Label>
			</Button>
			<Button variant="secondary" size="md">
				<Button.Label>Hello World</Button.Label>
			</Button>
			<Button variant="secondary" size="md" className="bg-amber-500">
				<Button.Label>Hello World</Button.Label>
			</Button>
			<Button variant="outline" size="lg">
				<Button.Label>Hello World</Button.Label>
			</Button>
		</View>
	);
}
