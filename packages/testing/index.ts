// @better-styled/testing
// This package provides testing utilities for better-styled components.
// The setup.ts file (loaded via bunfig.toml preload) configures:
// - happy-dom for DOM globals
// - jest-dom matchers for expect
// - automatic cleanup after each test
//
// Usage in tests:
// import { render, screen } from "@better-styled/testing"

// Use require to avoid Bun's "export default cannot be used with export *" error
// eslint-disable-next-line @typescript-eslint/no-require-imports
const testingLibraryReact = require("@testing-library/react")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestDomMatchers = require("@testing-library/jest-dom/matchers")

export const matchers = jestDomMatchers.default ?? jestDomMatchers
export const render = testingLibraryReact.render
export const screen = testingLibraryReact.screen
export const fireEvent = testingLibraryReact.fireEvent
export const waitFor = testingLibraryReact.waitFor
export const within = testingLibraryReact.within
export const cleanup = testingLibraryReact.cleanup
export const act = testingLibraryReact.act
export const renderHook = testingLibraryReact.renderHook

// Re-export types
export type {
	RenderResult,
	RenderOptions,
	RenderHookResult,
	RenderHookOptions,
} from "@testing-library/react"
