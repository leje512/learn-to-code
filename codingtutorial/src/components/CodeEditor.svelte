<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { linter, lintGutter } from "@codemirror/lint";
  import astlint, { clearLintDiagnostics } from "../lib/astlint";

  const dispatch = createEventDispatcher();
  export let initialcode = "";

  onMount(() => {
    // todo: min and max length of rows. rather scrolling than dynamically changing layout. probs css?
    new EditorView({
      doc: initialcode,
      extensions: [
        basicSetup,
        javascript(),
        lintGutter(),
        linter(astlint),
        EditorView.updateListener.of((update) => {
          dispatch("edited", {
            text: update.state.doc.toString(),
          });
          clearLintDiagnostics();
        }),
      ],
      parent: document.getElementById("codeeditor"),
    });
  });
</script>

<div id="codeeditor" />

<style>
  /*#codeeditor {
    width: 50vw;
  }
  #codeeditor .cm-editor {
    width: 100%;
    height: 30vh;
  }*/
</style>
