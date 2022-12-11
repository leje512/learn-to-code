import { assert } from "chai"
import { getDiagnostics, clearLintDiagnostics } from "./astlint.js"
import errorMessages from "./errorMessages.js"

beforeEach(() => {
  clearLintDiagnostics()
})

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
if (2 > 5) {
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
      const code = `
  if (true) {
    console.log("Different")
  }
  console.log("Text")`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 0)
    })
  })

  describe("errorSwitchedCompareSymbol", () => {
    const misconceptions = [
      {
        type: "node",
        check: errorMessages.errorSwitchedCompareSymbol,
        severity: "error",
        parseErrorCheck: "both",
      },
    ]
    it("with error", () => {
      const code = `
if (3 =< 5) {
  console.log("Text")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Das Gleichheitszeichen befindet sich bei Vergleichsoperatoren immer hinten.",
        "Mögliche Vergleichsoperatoren sind <, >, <=, >=, != und ==.",
        "Benutze >= 5, um 'Bestanden' anzuzeigen.",
      ])
    })
    it("no error", () => {
      const code = `
  if (3 <= 5) {
    console.log("Different Text")
  }
  console.log("Text")`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 0)
    })
  })

  describe("errorMissingIfElse", () => {
    const misconceptions = [
      {
        type: "ast",
        check: errorMessages.errorMissingIfElse,
        severity: "hint",
        parseErrorCheck: "regular",
      },
    ]
    it("with error", () => {
      const code = `
if (3 < 5) {
  console.log("Text")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Diese Aufgabe benötigt eine if- und else-Anweisung. Sind beide Teil des Codes?",
        `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
  if (kondition) {
    //code
  } else {
    //code
  }`,
        `Ergänze if- und else:
  if (kondition) {
    //code
  } else {
    //code
  }`,
      ])
    })
    it("no error", () => {
      const code = `
if (3 < 5) {
  console.log("Text")
} else {
  console.log("Different Text")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 0)
    })
  })

  describe("errorSemicolonAfterIfCondition", () => {
    const misconceptions = [
      {
        type: "node",
        check: errorMessages.errorSemicolonAfterIfCondition,
        severity: "error",
        parseErrorCheck: "regular",
      },
    ]
    it("with error", () => {
      const code = `
if (3 < 5); {
  console.log("Text")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte auf die richtige Syntax bei der if-else-Anweisung.",
        `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
  if (kondition) {
    //code
  } else {
    //code
  }`,
        "Entferne das Semikolon nach den Klammern der if-Anweisung. Hier wird keine Methode aufgerufen, sondern ein neuer Block geöffnet. Dies passiert nicht mit dem Semikolon, sondern mit geschweiften Klammern nach der Bedingung.",
      ])
    })
    it("no error", () => {
      const code = `
if (3 < 5) {
  console.log("Text");
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 0)
    })
  })
})
