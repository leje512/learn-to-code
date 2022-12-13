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

    let foundError = false
    misconceptions.forEach(
      ({
        type,
        severity,
        parseErrorCheck,
        condition,
        messages,
        exerciseSpecificMessage,
      }) => {
        if (parseErrorCheck == "regular" || parseErrorCheck == "both") {
          if (type == "node") {
            walk.fullAncestor(ast, (node, ancestors) => {
              const parent = ancestors[ancestors.length - 2]
              if (condition(node, parent)) {
                if (exerciseSpecificMessage) {
                  messages[messages.length - 1] = exerciseSpecificMessage
                }
                foundError = true
                diagnostics.push({
                  from: node.start,
                  to: node.end,
                  severity: severity,
                  messages,
                })
              }
            })
          } else if (type == "ast") {
            let existsInAst = false
            walk.fullAncestor(ast, (node, ancestors) => {
              const parent = ancestors[ancestors.length - 2]
              if (!existsInAst && condition(node, parent)) {
                existsInAst = true
              }
            })
            if (!existsInAst) {
              if (exerciseSpecificMessage) {
                messages[messages.length - 1] = exerciseSpecificMessage
              }
              foundError = true
              diagnostics.push({
                from: ast.start,
                to: ast.end,
                severity: severity,
                messages,
              })
            }
          }
        }
      }
    )

    if (!foundError) {
      diagnostics.push({
        from: 0,
        to: 0,
        severity: "praise",
        messages: [
          "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
        ],
      })
    }
  } catch (error) {
    // try again with a loose parse to get syntax errors
    let foundError = false
    try {
      const looseAst = acornLoose.parse(code, {
        ecmaVersion: "latest",
        sourceType: "script",
        allowReserved: "never",
      })
      misconceptions.forEach(
        ({
          type,
          severity,
          parseErrorCheck,
          condition,
          messages,
          exerciseSpecificMessage,
        }) => {
          if (parseErrorCheck == "parseError" || parseErrorCheck == "both") {
            walk.fullAncestor(looseAst, (node, ancestors) => {
              const parent = ancestors[ancestors.length - 2]
              const next = walk.findNodeAfter(
                looseAst,
                node.end + 1,
                () => true
              )
              if (condition(node, parent, code, next)) {
                if (exerciseSpecificMessage) {
                  messages[messages.length - 1] = exerciseSpecificMessage
                }
                foundError = true
                diagnostics.push({
                  from: node.start,
                  to: node.end,
                  severity: severity,
                  messages,
                })
              }
            })
          }
        }
      )
    } catch (looseError) {
      console.log("Konnte Code nicht übersetzen.", looseError)
    }

    if (!foundError) {
      // error could not be parsed and no helpful message was found
      diagnostics = [
        {
          from: error.pos,
          to: error.raisedAt,
          severity: "error",
          messages: [
            "Leider konnte der Code nicht übersetzt werden. Schau am besten nochmal drüber, ob sich nicht ein Fehler eingeschlichen hat.",
          ],
        },
        ...diagnostics,
      ]
    }
  }
  return diagnostics
}

export function clearLintDiagnostics() {
  diagnostics = []
}
