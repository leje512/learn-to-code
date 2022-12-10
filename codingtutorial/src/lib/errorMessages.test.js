import { assert } from "chai"
import { getDiagnostics } from "./astlint.js"
import errorMessages from "./errorMessages.js"

describe("errorMessages work as expected", () => {
  describe("no misconception should return no errors", () => {
    const misconceptions = []
    it("no error", () => {
      assert.deepEqual(getDiagnostics(misconceptions, ""), [])
    })
  })
  describe("errorConsoleLogNotInBody", () => {
    const misconceptions = [
      {
        type: "node",
        check: {
          ...errorMessages.errorConsoleLogNotInBody,
          condition: (...args) =>
            errorMessages.errorConsoleLogNotInBody.condition(...args, "Text"),
        },
        severity: "hint",
        parseErrorCheck: "regular",
      },
    ]
    it("with error", () => {
      const code = `
if (true) {
  console.log("Text")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
        "Code außerhalb von if-else wird immer ausgeführt.",
        "Mindestens ein Druck-Befehl (console.log()) sollte nicht in if-else enthalten sein. Stattdessen soll dieser danach ausgeführt werden. Lösche den Druckbefehl und schreibe ihn außerhalb der geschweiften Klammern von if und else, damit er immer ausgeführt wird, egal ob die Kondition true oder false ergibt.",
      ])
    })
    it("no error", () => {
      const misconceptions = [
        {
          type: "node",
          check: {
            ...errorMessages.errorConsoleLogNotInBody,
            condition: (...args) =>
              errorMessages.errorConsoleLogNotInBody.condition(...args, "Text"),
          },
          severity: "hint",
          parseErrorCheck: "regular",
        },
      ]
      it("with error", () => {
        const code = `
  if (true) {
    console.log("Different Text")
  }
  console.log("Text")`
        const errors = getDiagnostics(misconceptions, code)
        assert.lengthOf(errors, 0)
      })
    })
  })
})
