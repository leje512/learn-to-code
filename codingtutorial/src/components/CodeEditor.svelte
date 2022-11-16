<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { EditorView, basicSetup } from "codemirror"
  import { javascript } from "@codemirror/lang-javascript"
  import { linter, lintGutter } from "@codemirror/lint"
  import { EditorState } from "@codemirror/state"
  import astlint, { clearLintDiagnostics } from "../lib/astlint"

  const dispatch = createEventDispatcher()
  export let initialcode = "\n\n\n\n\n\n\n\n\n\n\n"

  let view
  let state = EditorState.create({
    doc: initialcode,
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
  })

  $: {
    if (view !== undefined) {
      const linebreakLength = initialcode.match(/\n/g)
        ? initialcode.match(/\n/g).length
        : 0
      let twentyLinesCode = initialcode + "\n".repeat(19 - linebreakLength)
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: twentyLinesCode,
        },
      })
    }
  }

  onMount(() => {
    view = new EditorView({
      state,
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
