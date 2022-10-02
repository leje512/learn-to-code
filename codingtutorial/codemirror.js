import { EditorView, basicSetup } from "codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";

// TODO: code from here? https://codesandbox.io/s/f6nb0?file=/src/index.js:236-253
import Linter from "eslint4b-prebuilt";

export const editor = new EditorView({
  doc: "\n\n\n\n\n\n\n", //TODO: multiple lines at creation
  extensions: [
    basicSetup,
    javascript(),
    lintGutter(),
    // @ts-ignore: ts2350
    linter(esLint(new Linter())),
    EditorView.updateListener.of((update) => {
      const codeedited = new CustomEvent("codeedited", {
        detail: update.state.doc.toString(),
      });
      document.getElementById("codeeditor").dispatchEvent(codeedited);
    }),
  ],
  parent: document.getElementById("codeeditor"),
});
