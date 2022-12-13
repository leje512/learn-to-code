import { assert } from "chai"
import { getDiagnostics, clearLintDiagnostics } from "./astlint.js"
import {
  errorMissingParenthesesIfCondition,
  errorSwitchedCompareSymbol,
  errorSemicolonAfterIfCondition,
  errorMissingIfElse,
  errorConsoleLogNotInBody,
  errorConsoleLogInBody,
  errorMissingFunctionKeyword,
  errorMissingFunctionName,
  errorLogicalOperator,
  errorUsageOfMathMax,
  errorConsoleLogInsteadOfReturn,
  errorMissingReturn,
  errorIncorrectNumberOfParams,
  errorIncorrectNumberOfCallArguments,
} from "./errorMessages.js"

beforeEach(() => {
  clearLintDiagnostics()
})

describe("errorMessages work as expected", () => {
  describe("no misconception should return no errors", () => {
    const misconceptions = []
    it("no error", () => {
      const errors = getDiagnostics(misconceptions, "")
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorConsoleLogNotInBody", () => {
    const misconceptions = [
      {
        ...errorConsoleLogNotInBody,
        condition: (...args) =>
          errorConsoleLogNotInBody.condition(...args, "Text"),
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
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorSwitchedCompareSymbol", () => {
    const misconceptions = [{ ...errorSwitchedCompareSymbol }]
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
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorMissingIfElse", () => {
    const misconceptions = [{ ...errorMissingIfElse }]
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
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorSemicolonAfterIfCondition", () => {
    const misconceptions = [
      {
        ...errorSemicolonAfterIfCondition,
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
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorSemicolonAfterIfCondition", () => {
    const misconceptions = [
      {
        ...errorMissingParenthesesIfCondition,
      },
    ]
    it("with error", () => {
      const code = `
if 3 < 5 {
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
        "Die Bedingung ist nicht in Klammern.",
      ])
    })
    it("no error", () => {
      const code = `
if (3 < 5) {
  console.log("Text");
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorConsoleLogInBody", () => {
    const misconceptions = [
      {
        ...errorConsoleLogInBody,
      },
    ]
    it("with error", () => {
      const code = `
if (3 < 5) {
  console.log("Text")
}
console.log("Wrong")`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte darauf, die if-else-then Syntax richtig zu verwenden.",
        `Die Befehle in der if-Bedingung werden ausgeführt, wenn die Bedingung true ergibt. Die Befehle in else werden nur ausgeführt, wenn die Bedingung false ergibt.
Code der weder in if noch in else enthalten ist, wird immer ausgeführt.`,
        "Achte darauf, dass bei dieser Aufgabe kein Code außerhalb von if oder else steht, da dieser sonst immer ausgeführt wird.",
      ])
    })
    it("no error", () => {
      const code = `
if (3 < 5) {
  console.log("Text");
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorMissingFunctionKeyword", () => {
    const misconceptions = [
      {
        ...errorMissingFunctionKeyword,
      },
    ]
    it("with error", () => {
      const code = `
name () {
  // function implementation
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Das Keyword function zeichnet einen Codeblock als Funktion aus.",
        `Nutze folgende Syntax um eine Funktion auszuzeichnen:
function name() { }`,
        "Ergänze das Keyword function vor dem Funktionsnamen.",
      ])
    })
    it("no error", () => {
      const code = `
function name () {
  // function implementation
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorMissingFunctionName", () => {
    const misconceptions = [
      {
        ...errorMissingFunctionName,
      },
    ]
    it("with error", () => {
      const code = `
function () {
  // function implementation
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Um eine Funktion aufrufen zu können benötigt diese einen Namen.",
        `Nutze folgende Syntax:
  function name() {
    // code 
  }`,
        "Zwischen dem Keyword function und den Funktionsparametern, also dem Teil in normalen Klammern, sollte der Name stehen.",
      ])
    })
    it("no error", () => {
      const code = `
function name () {
  // function implementation
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorLogicalOperator", () => {
    const misconceptions = [
      {
        ...errorLogicalOperator,
      },
    ]
    it("with error", () => {
      const code = `
if (true & true) {
  // code
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte auf die richtige Syntax bei der Verkettung.",
        "Logische Operatoren können so aussehen: && für UND, || für ODER, ! für NICHT",
        "Achte darauf, bei UND && und ODER || doppelte Zeichen zu benutzen, also z.B. && statt &, um mehrere Bedingungen miteinander zu verknüpfen.",
      ])
    })
    it("no error", () => {
      const code = `
if (true && true) {
  // code
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorUsageOfMathMax", () => {
    const misconceptions = [
      {
        ...errorUsageOfMathMax,
      },
    ]
    it("with error", () => {
      const code = `
Math.max(2, 3)`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, ["Benutze nicht Math.max()."])
    })
    it("no error", () => {
      const code = `
function max() {
  // code
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorMissingReturn", () => {
    const misconceptions = [
      {
        ...errorMissingReturn,
        condition: (...args) => errorMissingReturn.condition(...args, ["name"]),
      },
    ]
    it("with error", () => {
      const code = `
function name() {
  // missing return
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte darauf, für die Rückgabe return zu verwenden.",
        "Werte können mit dem Keyword return zurückgegeben werden. Dadurch wird der Wert an den Punkt weitergegeben, an dem die Funktion aufgerufen wird und kann z.B. in eine Variable gespeichert werden.",
        `Nutze folgende Syntax um einen Wert zurückzugeben: 
  return x
Ersetze x mit deinem Variablennamen oder dem richtigen Wert.`,
      ])
    })
    it("no error", () => {
      const code = `
function name() {
  return 0;
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorConsoleLogInsteadOfReturn", () => {
    const misconceptions = [
      {
        ...errorConsoleLogInsteadOfReturn,
        condition: (...args) =>
          errorConsoleLogInsteadOfReturn.condition(...args, ["name"]),
      },
    ]
    it("with error", () => {
      const code = `
function name() {
 console.log("log")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Achte darauf, für die Rückgabe return zu verwenden.",
        `Werte können mit dem Keyword return zurückgegeben werden. Dadurch wird der Wert an den Punkt weitergegeben, an dem die Funktion aufgerufen wird und kann z.B. in eine Variable gespeichert werden.
console.log() druckt den Wert stattdessen nur auf die Konsole.`,
        `Nutze statt console.log() return um einen Wert zurückzugeben. Die Syntax sieht so aus:
  return x
Ersetze x mit deinem Variablennamen oder dem richtigen Wert.`,
      ])
    })
    it("no error", () => {
      const code = `
function name() {
 console.log("log")
 return 0;
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorIncorrectNumberOfParams", () => {
    const misconceptions = [
      {
        ...errorIncorrectNumberOfParams,
        condition: (...args) =>
          errorIncorrectNumberOfParams.condition(...args, "name", 1),
      },
    ]
    it("with error", () => {
      const code = `
function name(one, two) {
 console.log("log")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Überprüfe die Aufgabenstellung. Haben deine Funktionen die richtige Parameterzahl?",
        "Parameter sind die Variablen, die in eine Funktion gegeben werden und dort für die Werte stehen. Diese werden in Klammern nach dem Funktionsnamen angegeben. Achte auf die korrekte Anzahl.",
        `So sieht ein Funktionskopf aus:
  function name(a, b)
a und b sind Parameter, hier zwei Stück. Überprüfe die Parameterzahl bei deinen Funktionen.`,
      ])
    })
    it("no error", () => {
      const code = `
function name(one) {
 console.log("log")
}`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })

  describe("errorIncorrectNumberOfCallArguments", () => {
    const misconceptions = [
      {
        ...errorIncorrectNumberOfCallArguments,
        condition: (...args) =>
          errorIncorrectNumberOfCallArguments.condition(...args, "name", 1),
      },
    ]
    it("with error", () => {
      const code = `
function name(one) {
 console.log("log")
}
name(1, 2)`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.deepEqual(errors[0].messages, [
        "Die Anzahl der Parameter bei der Initialisierung der Funktion und dem Aufruf der Funktion sollten übereinstimmen.",
        `function name(eins, zwei) {}
In dem Funktionsbeispiel oben wurden zwei Parameter initialisiert: eins und zwei.
Beim Funktionsaufruf sollten also ebenfalls zwei Parameter übergeben werden.`,
        "Für eine Funktion function name(eins, zwei) {} sollte der Funktionsaufruf so aussehen: name(a, b). name steht für den Namen der Funktion und a und b sind zwei übergebene Parameter. Die Anzahl der übergebenen Parameter muss dabei mit der Funktionsinitialisierung übereinstimmen.",
      ])
    })
    it("no error", () => {
      const code = `
function name(one) {
 console.log("log")
}
name(1)`
      const errors = getDiagnostics(misconceptions, code)
      assert.lengthOf(errors, 1)
      assert.equal(errors[0].severity, "praise")
      assert.deepEqual(errors[0].messages, [
        "Wenn du denkst, dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code überprüfen.",
      ])
    })
  })
})
