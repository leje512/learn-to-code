<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { isEqual } from "lodash"
  import { v4 as uuidv4 } from "uuid"
  import { EditorView, basicSetup } from "codemirror"
  import { autocompletion } from "@codemirror/autocomplete"
  import { javascript } from "@codemirror/lang-javascript"
  import { EditorState } from "@codemirror/state"
  import {
    highlightExtension,
    addHighlighting,
    clearHighlighting,
  } from "../lib/editorExtension.js"

  const dispatch = createEventDispatcher()
  export let initialcode = "\n\n\n\n\n\n\n\n\n\n\n"
  export let error = null
  export let showHighlighting = false

  let randomizedId = uuidv4()
  let previousError
  let view

  let state = EditorState.create({
    doc: initialcode,
    extensions: [
      basicSetup,
      javascript(),
      autocompletion({ activateOnTyping: false }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          dispatch("edited", {
            text: update.state.doc.toString(),
          })
          clearHighlighting(view)
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
    // watch showHighlighting and error
    if (
      view &&
      showHighlighting &&
      ((!error && !previousError) ||
        (error && !previousError) ||
        (error && previousError && !isEqual(error, previousError)))
    ) {
      addHighlighting(view, error.from, error.to)
      previousError = error
    } else if (!showHighlighting) {
      clearHighlighting(view)
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
