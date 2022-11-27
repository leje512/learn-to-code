import { getLineOfCodeByLineNumber, getLineOfCodeByStart } from "./utils"

// console.log("Auf Wiedersehen"); is not a child of script
const errorConsoleLogNotInBody = {
  condition: (node, parent) => {
    return (
      node.type == "ExpressionStatement" &&
      node.expression.callee.object.name == "console" &&
      node.expression.callee.property.name == "log" &&
      node.expression.arguments[0].value.includes("Auf Wiedersehen") &&
      parent.type !== "Program"
    )
  },
  messages: [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Code außerhalb von if-else wird immer ausgeführt.",
    "console.log('Auf Wiedersehen'); sollte nicht in if-else enthalten sein. Stattdessen wird diese danach ausgeführt.",
  ],
}

const errorSwitchedCompareSymbol = {
  condition: (node, parent) => {
    return (
      node.type == "IfStatement" &&
      (node.test.type == "ArrowFunctionExpression" ||
        node.test.type == "AssignmentExpression")
    )
  },
  messages: [
    "Das Gleichheitszeichen befindet sich bei Vergleichsoperatoren immer hinten.",
    "Mögliche Vergleichsoperatoren sind <, >, <=, >=, != und ==.",
    "Benutze >= 5, um 'Bestanden' anzuzeigen.",
  ],
}

const errorMissingIfElse = {
  condition: (node, parent) => {
    return (
      node.type &&
      node.type == "IfStatement" &&
      node.alternate &&
      node.alternate.type &&
      node.alternate.type == "BlockStatement"
    )
  },
  messages: [
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
  ],
}

const errorSemicolonAfterIfCondition = {
  condition: (node, parent) => {
    return (
      node.type == "IfStatement" && node.consequent.type == "EmptyStatement"
    )
  },
  messages: [
    "Achte auf die richtige Syntax bei der if-else-Anweisung.",
    `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
if (kondition) {
  //code
} else {
  //code
}`,
    "Entferne das Semikolon nach den Klammern der if-Anweisung. Hier wird keine Methode aufgerufen, sondern ein neuer Block geöffnet. Dies passiert nicht mit dem Semikolon, sondern mit geschweiften Klammern nach der Bedingung.",
  ],
}

const errorMissingParenthesesIfCondition = {
  condition: (node, parent, code) => {
    // unexpected token, after if in same row
    const lineNumber = getLineOfCodeByStart(code, node.start)
    const currentLine = getLineOfCodeByLineNumber(code, lineNumber)
    return (
      node.type == "IfStatement" &&
      (!currentLine.includes("(") || !currentLine.includes(")"))
    )
  },
  messages: [
    "Achte auf die richtige Syntax bei der if-else-Anweisung.",
    `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
if (kondition) {
  //code
} else {
  //code
}`,
    "Die Bedingung ist nicht in Klammern.",
  ],
}

export default {
  errorConsoleLogNotInBody,
  errorSwitchedCompareSymbol,
  errorMissingIfElse,
  errorSemicolonAfterIfCondition,
  errorMissingParenthesesIfCondition,
}
