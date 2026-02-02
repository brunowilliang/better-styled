/// <reference types="bun-types" />
// NOTE: happydom.ts MUST be loaded first via bunfig.toml preload
// to ensure DOM globals are available before @testing-library imports

import { afterEach, beforeEach, expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// Extend bun:test expect with jest-dom matchers
expect.extend(matchers);

// Cleanup render before and after each test
beforeEach(() => {
	cleanup();
	// Also clear body manually for happy-dom
	document.body.innerHTML = "";
});

afterEach(() => {
	cleanup();
	// Also clear body manually for happy-dom
	document.body.innerHTML = "";
});
