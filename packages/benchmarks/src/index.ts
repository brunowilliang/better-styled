/**
 * better-styled Benchmark Suite
 *
 * Run all benchmarks:
 *   bun run bench
 *
 * Run individual benchmarks:
 *   bun run bench:styled
 *   bun run bench:context
 *   bun run bench:slots
 *   bun run bench:integration
 *   bun run bench:config
 *   bun run bench:utils
 */

console.log(
	"╔═══════════════════════════════════════════════════════════════╗",
);
console.log(
	"║           better-styled Benchmark Suite                       ║",
);
console.log(
	"╚═══════════════════════════════════════════════════════════════╝",
);
console.log();

console.log("Running styled() benchmarks...");
console.log("─".repeat(65));
await import("./styled.bench");

console.log();
console.log();
console.log("Running createStyledContext() benchmarks...");
console.log("─".repeat(65));
await import("./createStyledContext.bench");

console.log();
console.log();
console.log("Running withSlots() benchmarks...");
console.log("─".repeat(65));
await import("./withSlots.bench");

console.log();
console.log();
console.log("Running integration benchmarks...");
console.log("─".repeat(65));
await import("./integration.bench");

console.log();
console.log();
console.log("Running styledConfig() benchmarks...");
console.log("─".repeat(65));
await import("./styledConfig.bench");

console.log();
console.log();
console.log("Running utils benchmarks...");
console.log("─".repeat(65));
await import("./utils.bench");

console.log();
console.log(
	"╔═══════════════════════════════════════════════════════════════╗",
);
console.log(
	"║           All benchmarks completed!                           ║",
);
console.log(
	"╚═══════════════════════════════════════════════════════════════╝",
);
