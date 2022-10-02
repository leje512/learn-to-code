/*import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";
// import eslint from "eslint-linter-browserify"; // Adds eslint.Linter to globalThis

const config = {
  // eslint configuration
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: ["error", "never"],
  },
};

const startState = EditorState.create({
  doc: 'console.log("Hello World")',
  extensions: [
    keymap.of(defaultKeymap),
    // EditorView.updateListener.of((update) => {
    //  codeInput = update.state.doc.text.join("\n");
    //}),
  ],
});

const view = new EditorView({
  extensions: [
    basicSetup,
    javascript(),
    lintGutter(),
    // linter(esLint(new eslint.Linter(), config)),
  ],
  state: startState,
  parent: document.getElementById("codeeditor"),
});

export { view };*/

import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

let editor = new EditorView({
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("codeeditor"),
});
console.log(document.getElementById("codeeditor"));
