import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            reportsDirectory: "coverage",
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/**/*.d.ts",
                "src/app/**",
                "src/components/**",
                "src/theme/**",
            ],
        },
    },
});
