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
    update(value, transaction) {
      console.log("before map")
      value = value.map(transaction.changes)
      console.log("transaction", transaction)
      for (let effect of transaction.effects) {
        if (effect.is(addHighlight)) {
          console.log("add")
          try {
            value = value.update({
              add: [highlightDecoration.range(effect.value)],
            })
          } catch (error) {}
        } else if (effect.is(removeHighlight)) {
          console.log("remove")
          try {
            value = value.update({
              filter: (f, t, value) => value.range !== undefined,
            })
          } catch (error) {}
        }
        try {
          value = value.update({ add: effect.value, sort: true })
        } catch (error) {}
      }
      return value
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  const highlightDecoration = Decoration.mark({
    attributes: { style: "background-color: #e67373" },
  })
  const noDecoration = Decoration.none
  const theme = EditorView.baseTheme({})

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
        clearHighlights()
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
      let effects = []
      effects.push(StateEffect.appendConfig.of([highlightExtension, theme]))
      view.dispatch({
        effects: StateEffect.define({
          map: ({ from, to }) => addHighlight.of({ from, to }),
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

  /* function clearHighlights(length) {
    if (view) {
      let effects = []
      effects.push(StateEffect.appendConfig.of([highlightExtension, theme]))
      view.dispatch({
        effects: StateEffect.define({
          map: ({ from, to }) => removeHighlight.of({ from, to }),
        }),
      })
      console.log("clear hightlights", length)
    }
  } */

  function clearHighlights(length) {
    console.log("clear")
    if (view) {
      let effects = []
      view
        .dispatch({
          effects: StateEffect.define({
            map: () => removeHighlight.of({ from: 0, to: length }),
          }),
        })
        .of([highlightDecoration.range(error.from, error.to)])
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
