import { EditorView, basicSetup } from "codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";

import Linter from "eslint4b-prebuilt";

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript(),
    lintGutter(),
    // @ts-ignore: ts2350
    linter(esLint(new Linter())),
  ],
  parent: document.getElementById("codeeditor"),
});
