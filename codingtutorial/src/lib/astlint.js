// @ts-nocheck
// TODO: this is the current workaround to get rid of all errors regarding missing properties on nodes

import { parse } from "acorn"
import * as walk from "acorn-walk"
import * as acornLoose from "acorn-loose"
import errorMessages from "./errorMessages"

let diagnostics = []

export function getDiagnostics(code) {
  try {
    const ast = parse(code, {
      ecmaVersion: "latest",
    })
    let missingIfElse = true
    walk.fullAncestor(ast, (node, ancestors) => {
      const parent = ancestors[ancestors.length - 2]
      let messages = []
      switch (true) {
        // console.log("Auf Wiedersehen"); is not a child of script
        case node.type == "ExpressionStatement" &&
          node.expression.callee.object.name == "console" &&
          node.expression.callee.property.name == "log" &&
          node.expression.arguments[0].value.includes("Auf Wiedersehen") &&
          parent.type !== "Program":
          messages = errorMessages.errorConsoleLogNotInBody
          break
        case node.type == "IfStatement" &&
          (node.test.type == "ArrowFunctionExpression" ||
            node.test.type == "AssignmentExpression"):
          messages = errorMessages.errorSwitchedCompareSymbol
          break
        case node.type == "IfStatement" ||
          (node.type == "IfStatement" &&
            node.alternate.type == "BlockStatement"):
          missingIfElse = false
          break
      }
      if (messages.length > 0) {
        diagnostics.push({
          from: node.start,
          to: node.end,
          severity: "warning",
          messages,
        })
      }
    })
    if (missingIfElse) {
      diagnostics.push({
        from: node.start,
        to: node.end,
        severity: "warning",
        messages: errorMessages.errorMissingIf,
      })
    }
  } catch (error) {
    // try again with a loose parse to get syntax errors
    try {
      const looseAst = acornLoose.parse(code, { ecmaVersion: "latest" })
      walk.fullAncestor(looseAst, (node, ancestors) => {
        const parent = ancestors[ancestors.length - 2]
        let messages = []
        switch (true) {
          // TODO: only works for =>
          case node.type == "IfStatement" &&
            node.test.type == "AssignmentExpression":
            messages = errorMessages.errorSwitchedCompareSymbol
            break
        }
        if (messages.length > 0) {
          diagnostics.push({
            from: node.start,
            to: node.end,
            severity: "warning",
            messages,
          })
        }
      })
    } catch (looseError) {
      console.log("Konnte Code nicht übersetzen.", looseError)
    }
  }
  return diagnostics
}

export function clearLintDiagnostics() {
  diagnostics = []
}
