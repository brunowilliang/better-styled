import "../global.css";

import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaListener } from "react-native-safe-area-context";
// import { Uniwind } from "uniwind";

export default function Layout() {
	return (
		<GestureHandlerRootView className="flex-1">
			{/* <SafeAreaListener
				onChange={({ insets }) => {
					Uniwind.updateInsets(insets);
				}}
			> */}
			<Slot />
			{/* </SafeAreaListener> */}
		</GestureHandlerRootView>
	);
}
