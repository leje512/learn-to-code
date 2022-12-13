import { parse } from "acorn"
import * as walk from "acorn-walk"
import * as acornLoose from "acorn-loose"

let diagnostics = []

export function getDiagnostics(misconceptions, code) {
  try {
    const ast = parse(code, {
      ecmaVersion: "latest",
      sourceType: "script",
      allowReserved: "never",
    })

    misconceptions.forEach((misconception) => {
      if (
        misconception.parseErrorCheck == "regular" ||
        misconception.parseErrorCheck == "both"
      ) {
        if (misconception.type == "node") {
          walk.fullAncestor(ast, (node, ancestors) => {
            const parent = ancestors[ancestors.length - 2]
            if (misconception.condition(node, parent)) {
              const messages = misconception.messages
              if (misconception.exerciseSpecificMessage) {
                messages[messages.length - 1] =
                  misconception.exerciseSpecificMessage
              }
              diagnostics.push({
                from: node.start,
                to: node.end,
                severity: misconception.severity,
                messages,
              })
            }
          })
        } else if (misconception.type == "ast") {
          let existsInAst = false
          walk.fullAncestor(ast, (node, ancestors) => {
            const parent = ancestors[ancestors.length - 2]
            if (!existsInAst && misconception.condition(node, parent)) {
              existsInAst = true
            }
          })
          if (!existsInAst) {
            const messages = misconception.messages
            if (misconception.exerciseSpecificMessage) {
              messages[messages.length - 1] =
                misconception.exerciseSpecificMessage
            }
            diagnostics.push({
              from: ast.start,
              to: ast.end,
              severity: misconception.severity,
              messages,
            })
          }
        }
      }
    })
  } catch (error) {
    // try again with a loose parse to get syntax errors
    try {
      const looseAst = acornLoose.parse(code, {
        ecmaVersion: "latest",
        sourceType: "script",
        allowReserved: "never",
      })
      misconceptions.forEach((misconception) => {
        if (
          misconception.parseErrorCheck == "parseError" ||
          misconception.parseErrorCheck == "both"
        ) {
          walk.fullAncestor(looseAst, (node, ancestors) => {
            const parent = ancestors[ancestors.length - 2]
            const next = walk.findNodeAfter(looseAst, node.end + 1, () => true)
            if (misconception.condition(node, parent, code, next)) {
              const messages = misconception.messages
              if (misconception.exerciseSpecificMessage) {
                messages[messages.length - 1] =
                  misconception.exerciseSpecificMessage
              }
              diagnostics.push({
                from: node.start,
                to: node.end,
                severity: misconception.severity,
                messages,
              })
            }
          })
        }
      })
    } catch (looseError) {
      // TODO: show code could not be parsed!
      console.log("Konnte Code nicht übersetzen.", looseError)
    }
  }
  return diagnostics
}

export function clearLintDiagnostics() {
  diagnostics = []
}
