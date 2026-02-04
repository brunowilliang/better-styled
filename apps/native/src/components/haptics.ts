import * as Haptics from 'expo-haptics'

export const haptics = {
	soft: {
		onPress: () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
		},
	},
	light: {
		onPress: () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		},
	},
	medium: {
		onPress: () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		},
	},
	heavy: {
		onPress: () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		},
	},
	rigid: {
		onPress: () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
		},
	},
}
