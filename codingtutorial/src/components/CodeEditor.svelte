<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { EditorView, basicSetup } from "codemirror"
  import { javascript } from "@codemirror/lang-javascript"
  import { linter, lintGutter } from "@codemirror/lint"
  import astlint, { clearLintDiagnostics } from "../lib/astlint"

  const dispatch = createEventDispatcher()
  export let initialcode = "\n\n\n\n\n\n\n\n\n\n\n"
  let twentyLinesCode =
    initialcode + "\n".repeat(19 - initialcode.match(/\n/g).length)

  onMount(() => {
    // todo: min and max length of rows. rather scrolling than dynamically changing layout. probs css?
    new EditorView({
      doc: twentyLinesCode,
      extensions: [
        basicSetup,
        javascript(),
        lintGutter(),
        linter(astlint),
        EditorView.updateListener.of((update) => {
          dispatch("edited", {
            text: update.state.doc.toString(),
          })
          clearLintDiagnostics()
        }),
      ],
      parent: document.getElementById("codeeditor"),
    })
  })
</script>

<div id="codeeditor" />

<style>
  #codeeditor :global(.cm-editor) {
    min-height: 300px;
    max-height: 300px;
    width: 50vw;
    max-width: 100%;
  }
</style>
