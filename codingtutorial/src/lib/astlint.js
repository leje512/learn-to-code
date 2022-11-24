// @ts-nocheck
// TODO: this is the current workaround to get rid of all errors regarding missing properties on nodes

import { parse } from "acorn"
import * as walk from "acorn-walk"

const errorStore = []
let diagnostics = []

export default (view) => {
  const ast = parse(view.state.doc.toString(), {
    ecmaVersion: "latest",
  })
  walk.fullAncestor(ast, (node, ancestors) => {
    switch (true) {
      case node.type == "ExpressionStatement" &&
        node.expression.callee.object.name == "console" &&
        node.expression.callee.property.name == "log" &&
        node.expression.arguments[0].value.includes("Auf Wiedersehen") &&
        ancestors[ancestors.length - 2].type !== "Program":
        errorConsoleLogNotInBody(node)
    }
  })
  return diagnostics
}

export function clearLintDiagnostics() {
  diagnostics = []
}

// console.log("Auf Wiedersehen"); is not a child of script
const errorConsoleLogNotInBody = (node) => {
  const messages = [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Code außerhalb von if-else wird immer ausgeführt.",
    "console.log('Auf Wiedersehen'); sollte nicht in if-else enthalten sein. Stattdessen wird diese danach ausgeführt.",
  ]
  // get biggest messageIndex at current node and use next message
  const messageIndex = errorStore.reduce((resultIndex, errorElement) => {
    if (errorElement.from === node.start && errorElement.to === node.end) {
      const newMessageIndex =
        messages.findIndex((message) => message === errorElement.message) + 1
      resultIndex =
        resultIndex > newMessageIndex ? resultIndex : newMessageIndex
    }
    return resultIndex
  }, 0)
  const diagnosticElement = {
    from: node.start,
    to: node.end,
    severity: "warning",
    message: messages[messageIndex],
  }
  if (messageIndex < messages.length - 1) {
    diagnosticElement.actions = [
      {
        name: "Mehr Informationen.",
        apply(view) {
          // TODO: compute linter here to reload changes
          errorStore.push({
            ...diagnosticElement,
            message: messages[messageIndex],
          })
        },
      },
    ]
  }
  diagnostics.push(diagnosticElement)
}
