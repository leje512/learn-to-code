import { nodeResolve } from "@rollup/plugin-node-resolve";
export default {
  input: "./codemirror.js",
  output: {
    file: "./codemirror.bundle.js",
    format: "iife",
  },
  plugins: [nodeResolve()],
};
