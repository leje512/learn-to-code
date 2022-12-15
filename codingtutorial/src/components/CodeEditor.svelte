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
  let cleared = true

  const addHighlight = StateEffect.define({
    map: ({ from, to }, change) => ({
      from: change.mapPos(from),
      to: change.mapPos(to),
    }),
  })
  const removeHighlight = StateEffect.define({
    map: ({ from, to }, change) => ({
      from: change.mapPos(from),
      to: change.mapPos(to),
    }),
  })
  const highlightExtension = StateField.define({
    create() {
      return Decoration.none
    },
    update(decorations, transaction) {
      decorations = decorations.map(transaction.changes)
      for (let effect of transaction.effects) {
        try {
          if (effect.is(addHighlight)) {
            decorations = decorations.update({
              add: [
                highlightDecoration.range(effect.value.from, effect.value.to),
              ],
            })
          } else if (effect.is(removeHighlight)) {
            decorations = decorations.update({
              filter: (f, t, value) => false,
            })
          }
        } catch (e) {
          console.log("error in extension", e)
        }
      }
      return decorations
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  const highlightDecoration = Decoration.mark({
    attributes: { style: "background-color: #e67373" },
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
        clearHighlighting()
        clearLintDiagnostics()
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
      addHighlighting(error.from, error.to)
      previousError = error
    }
  }

  onMount(() => {
    view = new EditorView({
      state,
      parent: document.getElementById("codeeditor"),
    })
  })

  function addHighlighting(start, end) {
    view.dispatch({
      effects: addHighlight.of({ from: start, to: end }),
    })
    cleared = false
  }

  function clearHighlighting() {
    console.log("cleared", cleared)
    if (view && !cleared) {
      cleared = true
      view.dispatch({
        effects: removeHighlight.of({ from: 0, to: view.state.doc.length }),
      })
    }
  }
</script>

<div id="codeeditor" />

<style>
  #codeeditor :global(.cm-editor) {
    width: 50vw;
    max-width: 100%;
    max-height: 70vh;
    height: 70vh;
  }
</style>
