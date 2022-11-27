import { parse } from "acorn"
import * as walk from "acorn-walk"
import * as acornLoose from "acorn-loose"

let diagnostics = []

export function getDiagnostics(misconceptions, code) {
  try {
    const ast = parse(code, {
      ecmaVersion: "latest",
    })

    misconceptions.forEach((misconception) => {
      if (misconception.type == "node") {
        walk.fullAncestor(ast, (node, ancestors) => {
          const parent = ancestors[ancestors.length - 2]
          if (misconception.check.condition(node, parent)) {
            diagnostics.push({
              from: node.start,
              to: node.end,
              severity: misconception.severity,
              messages: misconception.check.messages,
            })
          }
        })
      } else if (misconception.type == "ast") {
        let existsInAst = false
        walk.fullAncestor(ast, (node, ancestors) => {
          const parent = ancestors[ancestors.length - 2]
          if (!existsInAst && misconception.check.condition(node, parent)) {
            existsInAst = true
          }
        })
        if (!existsInAst) {
          diagnostics.push({
            from: ast.start,
            to: ast.end,
            severity: misconception.severity,
            messages: misconception.check.messages,
          })
        }
      }
    })
  } catch (error) {
    // try again with a loose parse to get syntax errors
    try {
      const looseAst = acornLoose.parse(code, { ecmaVersion: "latest" })
      misconceptions.forEach((misconception) => {
        walk.fullAncestor(looseAst, (node, ancestors) => {
          const parent = ancestors[ancestors.length - 2]
          if (misconception.check.condition(node, parent)) {
            diagnostics.push({
              from: node.start,
              to: node.end,
              severity: misconception.severity,
              messages: misconception.check.messages,
            })
          }
        })
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
