import { EditorView } from "codemirror"
import { Decoration } from "@codemirror/view"
import { StateField, StateEffect } from "@codemirror/state"

let cleared = true

const addHighlight = StateEffect.define()
const removeHighlight = StateEffect.define()
const highlightDecoration = Decoration.mark({
  attributes: { style: "background-color: #e67373" },
})

const highlightExtension = StateField.define({
  create() {
    return Decoration.none
  },
  update(decorations, transaction) {
    decorations = decorations.map(transaction.changes)
    for (const effect of transaction.effects) {
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

function addHighlighting(view, start, end) {
  view.dispatch({
    effects: addHighlight.of({ from: start, to: end }),
  })
  cleared = false
}

function clearHighlighting(view) {
  if (view && !cleared) {
    cleared = true
    view.dispatch({
      effects: removeHighlight.of({ from: 0, to: view.state.doc.length }),
    })
  }
}

export {
  addHighlight,
  removeHighlight,
  highlightDecoration,
  highlightExtension,
  addHighlighting,
  clearHighlighting,
}
