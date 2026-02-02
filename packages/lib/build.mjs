import { $ } from "bun";

const entrypoint = "./index.ts";
const outdir = "./dist";

console.log("🧹 Cleaning output directory...");
await $`rm -rf ${outdir}`;

console.log("📦 Building package...");

const result = await Bun.build({
	entrypoints: [entrypoint],
	outdir: outdir,
	target: "browser",
	format: "esm",
	splitting: true,
	sourcemap: "none",
	minify: true,
	external: ["react", "react-dom", "react-native"],
});

if (!result.success) {
	console.error("❌ Build failed:");
	console.error(result.logs.join("\n"));
	process.exit(1);
}

console.log("📝 Generating types...");
await $`tsc --project tsconfig.json`;

console.log("✅ Build finished!");
