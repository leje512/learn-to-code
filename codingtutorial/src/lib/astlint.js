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
      const parent = ancestors[ancestors.length - 2]
      switch (true) {
        case node.type == "ExpressionStatement" &&
          node.expression.callee.object.name == "console" &&
          node.expression.callee.property.name == "log" &&
          node.expression.arguments[0].value.includes("Auf Wiedersehen") &&
          parent.type !== "Program":
          errorConsoleLogNotInBody(node)
        case node.type == "ArrowFunctionExpression" &&
          parent.type == "IfStatement":
          errorSwitchedCompareSymbol(node)
        case !ast.body.find((node) => node.type == "IfStatement") ||
          !ast.body.find(
            (node) => node.type == "IfStatement" && node.alternate
          ):
          errorMissingIf(ast)
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

const errorSwitchedCompareSymbol = (node) => {
  const messages = [
    "Das Gleichheitszeichen befindet sich bei Vergleichsoperatoren immer hinten.",
    "Mögliche Vergleichsoperatoren sind <, >, <=, >=, != und ==.",
    "Benutze >= 5, um 'Bestanden' anzuzeigen.",
  ]
  const diagnosticElement = {
    from: node.start,
    to: node.end,
    severity: "warning",
    messages,
  }
  diagnostics.push(diagnosticElement)
}

const errorMissingIf = (node) => {
  const messages = [
    "Diese Aufgabe benötigt eine if- und else-Anweisung. Sind beide Teil des Codes?",
    `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
if (kondition) {
  //code
} else {
  //code
}`,
    `Ergänze folgende Syntax um den richtigen Code:
if (punkte mindestens 5) {
  // drucke "Bestanden"
} else {
  // drucke "Durchgefallen"
}`,
  ]
  const diagnosticElement = {
    from: node.start,
    to: node.end,
    severity: "warning",
    messages,
  }
  diagnostics.push(diagnosticElement)
}
