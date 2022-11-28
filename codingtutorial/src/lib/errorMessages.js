import { getLineOfCodeByLineNumber, getLineOfCodeByStart } from "./utils"

// console.log("Auf Wiedersehen"); is not a child of script
const errorConsoleLogNotInBody = {
  condition: (node, parent, text) => {
    return (
      node.type == "ExpressionStatement" &&
      node.expression.callee.object.name == "console" &&
      node.expression.callee.property.name == "log" &&
      node.expression.arguments[0].value.includes(text) &&
      parent.type !== "Program"
    )
  },
  messages: [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Code außerhalb von if-else wird immer ausgeführt.",
    "Mindestens ein Druck-Befehl (console.log()) sollte nicht in if-else enthalten sein. Stattdessen soll dieser danach ausgeführt werden. Lösche den Druckbefehl und schreibe ihn außerhalb der geschweiften Klammern von if und else, damit er immer ausgeführt wird, egal ob die Kondition true oder false ergibt.",
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
      (node.alternate.type == "BlockStatement" ||
        node.alternate.type == "IfStatement")
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
    `Ergänze if- und else:
      if (kondition) {
        //code
      } else {
        //code
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

const errorStatementInBody = {
  condition: (node, parent) => {
    return node.type == "ExpressionStatement" && parent.type == "Program"
  },
  messages: [
    "Achte darauf, die if-else-then Syntax richtig zu verwenden.",
    `Die Befehle in der if-Bedingung werden ausgeführt, wenn die Bedingung true ergibt. Die Befehle in else werden nur ausgeführt, wenn die Bedingung false ergibt.
Code der weder in if noch in else enthalten ist, wird immer ausgeführt.`,
    "Achte darauf, dass bei dieser Aufgabe kein Code außerhalb von if oder else steht, da dieser sonst immer ausgeführt wird.",
  ],
}

const errorMissingFunctionKeyword = {
  condition: (node, parent, code, nextSibling) => {
    const lineNumber = getLineOfCodeByStart(code, node.start)
    const currentLine = getLineOfCodeByLineNumber(code, lineNumber)
    return (
      node.type == "Identifier" &&
      nextSibling &&
      nextSibling.node.type == "BlockStatement" &&
      !currentLine.includes("function")
    )
  },
  messages: [
    "Eine Funktion wurde mehrfach deklariert.",
    "Jede Funktion braucht einen eigenen Namen.",
    `Achte darauf, dass keine Funktionsnamen gleich sind, da bei Javascript die Funktionen über ihren Namen aufgerufen werden. Der Funktionsname steht zwischen dem Keyword function und den Klammern:
      function name()`,
  ],
}

const errorMissingFunctionName = {
  condition: (node, parent) => {
    return (
      node.type == "FunctionDeclaration" &&
      node.id.type == "Identifier" &&
      node.id.name == "✖"
    )
  },
  messages: [
    "Um eine Funktion aufrufen zu können benötigt diese einen Namen.",
    `Nutze folgende Syntax:
function name() {
  // code 
}`,
    "Zwischen dem Keyword function und den Funktionsparametern, also dem Teil in normalen Klammern, sollte der Name stehen.",
  ],
}

export default {
  errorConsoleLogNotInBody,
  errorSwitchedCompareSymbol,
  errorMissingIfElse,
  errorSemicolonAfterIfCondition,
  errorMissingParenthesesIfCondition,
  errorStatementInBody,
  errorMissingFunctionKeyword,
  errorMissingFunctionName,
}
