import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig(({ mode }) => ({
	server: {
		port: 3500,
	},
	plugins: mode === "development" ? [react(), eslintPlugin()] : [],
	build: {
		sourcemap: true,
	},
}));
