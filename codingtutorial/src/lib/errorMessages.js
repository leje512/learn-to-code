import { getLineOfCodeByLineNumber, getLineOfCodeByStart } from "./utils.js"
import * as walk from "acorn-walk"

const isConsoleLog = (node) => {
  return (
    node.type == "ExpressionStatement" &&
    node.expression.callee.object.name == "console" &&
    node.expression.callee.property.name == "log"
  )
}

const consoleLogIncludesText = (node, text) => {
  return isConsoleLog(node) && node.expression.arguments[0].value.includes(text)
}

const isIfStatement = (node) => {
  return node.type == "IfStatement"
}

const isElseOrElseIfStatement = (node) => {
  return (
    node.alternate &&
    node.alternate.type &&
    (node.alternate.type == "BlockStatement" ||
      node.alternate.type == "IfStatement")
  )
}

const isFunctionDeclaration = (node) => {
  return node.type == "FunctionDeclaration"
}

const isFunctionCall = (node) => {
  return node.type == "CallExpression"
}

// console.log("Auf Wiedersehen"); is not a child of script
const errorConsoleLogNotInBody = {
  condition: (node, parent, text) => {
    return (
      isConsoleLog(node) &&
      consoleLogIncludesText(node, text) &&
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
      isIfStatement(node) &&
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
    return node.type && isIfStatement(node) && isElseOrElseIfStatement(node)
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
      isIfStatement(node) &&
      node.consequent &&
      node.consequent.type == "EmptyStatement"
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
      isIfStatement(node) &&
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

const errorConsoleLogInBody = {
  condition: (node, parent) => {
    return isConsoleLog(node) && parent.type == "Program"
  },
  messages: [
    "Achte darauf, die if-else-then Syntax richtig zu verwenden.",
    `Die Befehle in der if-Bedingung werden ausgeführt, wenn die Bedingung true ergibt. Die Befehle in else werden nur ausgeführt, wenn die Bedingung false ergibt.
Code der weder in if noch in else enthalten ist, wird immer ausgeführt.`,
    "Achte darauf, dass bei dieser Aufgabe kein Code außerhalb von if oder else steht, da dieser sonst immer ausgeführt wird.",
  ],
}

const errorMissingFunctionKeyword = {
  condition: (node, parent, code, next) => {
    const lineNumber = getLineOfCodeByStart(code, node.start)
    const currentLine = getLineOfCodeByLineNumber(code, lineNumber)
    return (
      node.type == "Identifier" &&
      next &&
      next.node.type == "BlockStatement" &&
      !currentLine.includes("function")
    )
  },
  messages: [
    "Das Keyword function zeichnet einen Codeblock als Funktion aus.",
    `Nutze folgende Syntax um eine Funktion auszuzeichnen:
function name() { }`,
    "Ergänze das Keyword function vor dem Funktionsnamen.",
  ],
}

const errorMissingFunctionName = {
  condition: (node, parent) => {
    return (
      isFunctionDeclaration(node) &&
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

const errorLogicalOperator = {
  condition: (node, parent) => {
    return (
      isIfStatement(node) &&
      node.test.type == "BinaryExpression" &&
      (node.test.operator == "&" || node.test.operator == "|")
    )
  },
  messages: [
    "Achte auf die richtige Syntax bei der Verkettung.",
    "Logische Operatoren können so aussehen: && für UND, || für ODER, ! für NICHT",
    "Achte darauf, bei UND && und ODER || doppelte Zeichen zu benutzen, also z.B. && statt &, um mehrere Bedingungen miteinander zu verknüpfen.",
  ],
}

const errorUsageOfMathMax = {
  condition: (node, parent) => {
    return (
      isFunctionCall(node) &&
      node.callee &&
      node.callee.object &&
      node.callee.property &&
      node.callee.object.name == "Math" &&
      node.callee.property.name == "max"
    )
  },
  messages: ["Benutze nicht Math.max()."],
}

const errorMissingReturn = {
  condition: (node, parent, functionNames) => {
    const returnChildren = walk.findNodeAfter(
      node,
      0,
      (nodeType) => nodeType == "ReturnStatement"
    )
    return (
      isFunctionDeclaration(node) &&
      node.id.type == "Identifier" &&
      functionNames.includes(node.id.name) &&
      !returnChildren
    )
  },
  messages: [
    "Achte darauf, für die Rückgabe return zu verwenden.",
    "Werte können mit dem Keyword return zurückgegeben werden. Dadurch wird der Wert an den Punkt weitergegeben, an dem die Funktion aufgerufen wird und kann z.B. in eine Variable gespeichert werden.",
    `Nutze folgende Syntax um einen Wert zurückzugeben: 
  return x
Ersetze x mit deinem Variablennamen oder dem richtigen Wert.`,
  ],
}

const errorConsoleLogInsteadOfReturn = {
  condition: (node, parent, functionNames) => {
    const consoleLogChildren = walk.findNodeAfter(node, 0, (nodeType, node) =>
      isConsoleLog(node)
    )
    const returnChildren = walk.findNodeAfter(
      node,
      0,
      (nodeType) => nodeType == "ReturnStatement"
    )
    return (
      isFunctionDeclaration(node) &&
      node.id.type == "Identifier" &&
      functionNames.includes(node.id.name) &&
      consoleLogChildren &&
      !returnChildren
    )
  },
  messages: [
    "Achte darauf, für die Rückgabe return zu verwenden.",
    `Werte können mit dem Keyword return zurückgegeben werden. Dadurch wird der Wert an den Punkt weitergegeben, an dem die Funktion aufgerufen wird und kann z.B. in eine Variable gespeichert werden.
console.log() druckt den Wert stattdessen nur auf die Konsole.`,
    `Nutze statt console.log() return um einen Wert zurückzugeben. Die Syntax sieht so aus:
  return x
Ersetze x mit deinem Variablennamen oder dem richtigen Wert.`,
  ],
}

const errorIncorrectNumberOfParams = {
  condition: (node, parent, functionName, length) => {
    return (
      isFunctionDeclaration(node) &&
      node.params.length !== length &&
      node.id.name == functionName
    )
  },
  messages: [
    "Überprüfe die Aufgabenstellung. Haben deine Funktionen die richtige Parameterzahl?",
    "Parameter sind die Variablen, die in eine Funktion gegeben werden und dort für die Werte stehen. Diese werden in Klammern nach dem Funktionsnamen angegeben. Achte auf die korrekte Anzahl.",
    `So sieht ein Funktionskopf aus:
  function name(a, b)
a und b sind Parameter, hier zwei Stück. Überprüfe die Parameterzahl bei deinen Funktionen.`,
  ],
}

const errorIncorrectNumberOfCallArguments = {
  condition: (node, parent, functionName, length) => {
    return (
      isFunctionCall(node) &&
      node.callee &&
      node.callee.name == functionName &&
      node.arguments.length !== length
    )
  },
  messages: [
    "Die Anzahl der Parameter bei der Initialisierung der Funktion und dem Aufruf der Funktion sollten übereinstimmen.",
    `function name(eins, zwei) {}
In dem Funktionsbeispiel oben wurden zwei Parameter initialisiert: eins und zwei.
Beim Funktionsaufruf sollten also ebenfalls zwei Parameter übergeben werden.`,
    "Für eine Funktion function name(eins, zwei) {} sollte der Funktionsaufruf so aussehen: name(a, b). name steht für den Namen der Funktion und a und b sind zwei übergebene Parameter. Die Anzahl der übergebenen Parameter muss dabei mit der Funktionsinitialisierung übereinstimmen.",
  ],
}

export default {
  errorConsoleLogNotInBody,
  errorSwitchedCompareSymbol,
  errorMissingIfElse,
  errorSemicolonAfterIfCondition,
  errorMissingParenthesesIfCondition,
  errorConsoleLogInBody,
  errorMissingFunctionKeyword,
  errorMissingFunctionName,
  errorLogicalOperator,
  errorUsageOfMathMax,
  errorConsoleLogInsteadOfReturn,
  errorMissingReturn,
  errorIncorrectNumberOfParams,
  errorIncorrectNumberOfCallArguments,
}
