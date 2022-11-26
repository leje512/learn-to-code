// @ts-nocheck
// TODO: this is the current workaround to get rid of all errors regarding missing properties on nodes

import { parse } from "acorn"
import * as walk from "acorn-walk"

let diagnostics = []

/* export default (view) => {
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
} */

export function getDiagnostics(code) {
  try {
    const ast = parse(code, {
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
  } catch (error) {
    diagnostics.push({
      from: error.pos,
      to: error.raisedAt,
      severity: "error",
      messages: [
        "Syntax Fehler: Unerwartetes Zeichen. Achte auf die richtige Syntax.",
      ],
    })
  }
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
  const diagnosticElement = {
    from: node.start,
    to: node.end,
    severity: "warning",
    messages,
  }
  diagnostics.push(diagnosticElement)
}
