<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { EditorView, basicSetup } from "codemirror"
  import { javascript } from "@codemirror/lang-javascript"
  // import { linter, lintGutter } from "@codemirror/lint"
  import { EditorState } from "@codemirror/state"
  import { clearLintDiagnostics } from "../lib/astlint.js"
  import {
    highlightExtension,
    addHighlighting,
    clearHighlighting,
  } from "../lib/editorExtension.js"
  import { isEqual } from "lodash"
  import { v4 as uuidv4 } from "uuid"

  const dispatch = createEventDispatcher()
  export let initialcode = "\n\n\n\n\n\n\n\n\n\n\n"
  export let error = null
  export let showErrorMessage = false

  let randomizedId = uuidv4()
  let previousError
  let view

  let state = EditorState.create({
    doc: initialcode,
    extensions: [
      basicSetup,
      javascript(),
      /* lintGutter(),
      linter(astlint), */
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          dispatch("edited", {
            text: update.state.doc.toString(),
          })
          clearHighlighting(view)
          clearLintDiagnostics()
        }
      }),
      highlightExtension,
    ],
  })

  $: {
    // watch initialcode
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

  $: {
    // watch showErrorMessage and error
    if (
      view &&
      showErrorMessage &&
      ((error && !previousError) ||
        (error && previousError && !isEqual(error, previousError)))
    ) {
      addHighlighting(view, error.from, error.to)
      previousError = error
    }
  }

  onMount(() => {
    view = new EditorView({
      state,
      parent: document.getElementById(randomizedId),
    })
  })
</script>

<div class="codeeditor" id={randomizedId} />

<style>
  .codeeditor :global(.cm-editor) {
    max-width: 100%;
    max-height: 70vh;
    height: 70vh;
    background-color: white;
  }
  :global(.ͼ1 .cm-scroller) {
    overflow-x: initial;
  }
</style>
