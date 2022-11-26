<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { EditorView, basicSetup } from "codemirror"
  import { javascript } from "@codemirror/lang-javascript"
  // import { linter, lintGutter } from "@codemirror/lint"
  import { EditorState, StateField, StateEffect } from "@codemirror/state"
  import { Decoration } from "@codemirror/view"
  import { clearLintDiagnostics } from "../lib/astlint"
  import { isEqual } from "lodash"

  const dispatch = createEventDispatcher()
  export let initialcode = "\n\n\n\n\n\n\n\n\n\n\n"
  export let error
  export let showErrorMessage = false

  let previousError

  let view
  const highlightExtension = StateField.define({
    create() {
      return Decoration.none
    },
    update(value, transaction) {
      value = value.map(transaction.changes)

      for (let effect of transaction.effects) {
        try {
          value = value.update({ add: effect.value, sort: true })
        } catch (error) {}
      }
      return value
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  const highlightDecoration = Decoration.mark({
    attributes: { style: "background-color: red" },
  })

  let state = EditorState.create({
    doc: initialcode,
    extensions: [
      basicSetup,
      javascript(),
      /* lintGutter(),
      linter(astlint), */
      EditorView.updateListener.of((update) => {
        dispatch("edited", {
          text: update.state.doc.toString(),
        })
        clearLintDiagnostics()
      }),
      highlightExtension,
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

  $: {
    if (
      showErrorMessage &&
      ((error && !previousError) ||
        (error && previousError && !isEqual(error, previousError)))
    ) {
      view.dispatch({
        effects: StateEffect.define({
          map: ({ from, to }) => ({ from, to }),
        }).of([highlightDecoration.range(error.from, error.to)]),
      })
      previousError = error
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
