import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.js",
    core: "src/tealeaf-core.js",
    browser: "src/tealeaf-browser.js",
    react: "src/react/index.js",
  },
  format: ["esm", "cjs"],
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  minify: false,
  external: ["react", "react-dom"],
  target: "es2020",
});
