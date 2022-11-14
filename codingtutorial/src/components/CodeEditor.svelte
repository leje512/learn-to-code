<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { javascript, esLint } from "@codemirror/lang-javascript";
  import { linter, lintGutter } from "@codemirror/lint";
  import { syntaxTree } from "@codemirror/language";
  import Linter from "eslint4b-prebuilt"; // TODO: cite code?? https://codesandbox.io/s/f6nb0?file=/src/index.js:236-253

  const dispatch = createEventDispatcher();
  export let initialcode = "";

  const customLinter = linter((view) => {
    let diagnostics = [];
    syntaxTree(view.state)
      .cursor()
      .iterate((node) => {
        if (
          node.name == "ExpressionStatement" &&
          node.node.parent.name == "Script"
        ) {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: "warning",
            message:
              "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
          });
        }
      });
    return diagnostics;
  });

  onMount(() => {
    new EditorView({
      doc: initialcode, //TODO: multiple lines at creation
      extensions: [
        basicSetup,
        javascript(),
        lintGutter(),
        // @ts-ignore: ts2350
        customLinter,
        EditorView.updateListener.of((update) => {
          dispatch("edited", {
            text: update.state.doc.toString(),
          });
        }),
      ],
      parent: document.getElementById("codeeditor"),
    });
  });
</script>

<div id="codeeditor" />

<style>
  #codeeditor {
    width: 50vw;
  }
  #codeeditor .cm-editor {
    width: 100%;
    height: 30vh;
  }
</style>
