import {
  errorMissingConsoleLog,
  errorMissingParenthesesIfCondition,
  errorSwitchedCompareSymbol,
  errorSemicolonAfterIfCondition,
  errorMissingIfElse,
  errorConsoleLogNotInBody,
  errorConsoleLogInBody,
  errorMissingFunction,
  errorMissingFunctionKeyword,
  errorMissingFunctionName,
  errorLogicalOperator,
  errorUsageOfMathMax,
  errorConsoleLogInsteadOfReturn,
  errorMissingReturn,
  errorIncorrectNumberOfParams,
  errorIncorrectNumberOfCallArguments,
} from "./errorMessages.js"

export default [
  {
    title: "if-else",
    task: `Es ist eine Punktzahl gegeben: 
<code>let punkte = 10</code>
Schreibe ein Programm, dass bei einer Punktzahl von mindestens 5 ausgibt:
<code class="terminal">Bestanden. 
Auf Wiedersehen.</code>
Bei 4 oder weniger Punkten wird folgendes ausgegeben:
<code class="terminal">Leider durchgefallen.
Auf Wiedersehen.</code>`,
    solution: `let punkte = 10;

if (punkte >= 5) {
  console.log("Bestanden.");
} else {
  console.log("Leider durchgefallen.");
}
    
console.log("Auf Wiedersehen.");`,
    initialcode: "let punkte = 10;",
    testCases: [
      {
        variableName: "punkte",
        variableReplaceValue: 4,
        consoleResult: "Leider durchgefallen.\nAuf Wiedersehen.\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 5,
        consoleResult: "Bestanden.\nAuf Wiedersehen.\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 6,
        consoleResult: "Bestanden.\nAuf Wiedersehen.\n",
      },
    ],
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        ...errorMissingParenthesesIfCondition,
      },
      {
        ...errorSemicolonAfterIfCondition,
      },
      {
        ...errorSwitchedCompareSymbol,
      },
      {
        ...errorMissingIfElse,
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code:
if (punkte mindestens 5) {
  // drucke "Bestanden"
} else {
  // drucke "Durchgefallen"
}`,
      },
      {
        ...errorMissingConsoleLog,
      },
      {
        ...errorConsoleLogNotInBody,
        condition: (...args) =>
          errorConsoleLogNotInBody.condition(...args, "Auf Wiedersehen"),
        exerciseSpecificMessage:
          "console.log('Auf Wiedersehen'); sollte nicht in if-else enthalten sein. Stattdessen soll dies danach ausgeführt werden. Dadurch muss die Zeile auch nicht doppelt, sondern nur einmal geschrieben werden.",
      },
    ],
  },
  {
    title: "if-else-if",
    task: `Es ist eine Punktzahl gegeben: 
<code>let punktzahl = 10</code>
Schreiben Sie ein Programm, dass bei verschiedenen Punktständen ausgibt, wie die Klausur ausfällt:
<code>0-10: Durchgefallen
11-20: Naja
21-30: Mittelgut
31-40: Gut
41-50: Super</code>
Die Höchstpunktzahl sind 50 Punkte, deshalb wird bei mehr Punkten kein Text ausgegeben.`,
    solution: `let punkte = 10;

    if (punkte <= 10) {
     console.log("Durchgefallen");
    } else if (punkte <=20) {
     console.log("Naja");
    } else if (punkte <= 30) {
      console.log("Mittelgut");
    } else if (punkte <= 40) {
      console.log("Gut");
    } else if (punkte <= 50) {
      console.log("Super");
    }`,
    initialcode: `let punkte = 10;
console.log("Durchgefallen");`,
    testCases: [
      {
        variableName: "punkte",
        variableReplaceValue: 9,
        consoleResult: "Durchgefallen\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 11,
        consoleResult: "Naja\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 20,
        consoleResult: "Naja\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 29,
        consoleResult: "Mittelgut\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 39,
        consoleResult: "Gut\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 49,
        consoleResult: "Super\n",
      },
      {
        variableName: "punkte",
        variableReplaceValue: 51,
        consoleResult: "",
      },
    ],
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        ...errorMissingParenthesesIfCondition,
      },
      {
        ...errorSemicolonAfterIfCondition,
      },
      {
        ...errorSwitchedCompareSymbol,
      },
      {
        ...errorMissingIfElse,
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code und erweitere um weitere else if Bedingungen:
if (punkte <= 10) {
  // drucke Durchgefallen
} else if (punkte <=20) {
  // drucke Naja
}`,
      },
      {
        ...errorMissingConsoleLog,
      },
      {
        ...errorConsoleLogInBody,
        exerciseSpecificMessage:
          "Achte darauf, dass bei dieser Aufgabe kein console.log außerhalb von if oder else steht, da dieser sonst immer ausgeführt wird. Hier soll aber nur ein bestimmter Text für jeden Fall angezeigt werden.",
      },
    ],
  },
  {
    title: "function-max",
    task: `Schreibe zwei Funktionen. Die erste Funktion <code>max2</code> bekommt zwei Parameter und vergleicht die beiden miteinander. Gebe den größeren Wert zurück.
Die zweite Funktion <code>max3</code> bekommt drei Parameter und gibt ebenfalls den größten der drei Parameter zurück. 
Verwende dabei nicht Math.max().`,
    solution: `function max2(a, b) {
  if (a > b) {
    return a
  } else {
    return b
  }
}
    
function max3(a, b, c) {
  if (a > b && a > c) {
    return a
  } else if (b > a && b > c) {
    return b
  } else {
    return c
  }
}`,
    initialcode: `function max2() {
  return 0;
}

max2(10, 5);`,
    testCases: [
      {
        functionTest: "max2(1, 2)",
        functionResult: 2,
      },
      {
        functionTest: "max2(-10, 20)",
        functionResult: 20,
      },
      {
        functionTest: "max2(0, 0)",
        functionResult: 0,
      },
      {
        functionTest: "max2(-1, -2)",
        functionResult: -1,
      },
      {
        functionTest: "max3(-1, -2, -15)",
        functionResult: -1,
      },
      {
        functionTest: "max3(1, 5, 1)",
        functionResult: 5,
      },
      {
        functionTest: "max3(156, 325, 661)",
        functionResult: 661,
      },
      {
        functionTest: "max3(1, 5456, -781)",
        functionResult: 5456,
      },
    ],
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        ...errorMissingFunctionKeyword,
      },
      {
        ...errorMissingFunctionName,
        exerciseSpecificMessage: `Zwischen dem Keyword function und den Funktionsparametern, also dem Teil in normalen Klammern, sollte der Name stehen.
function name() {
  // code 
}
In dieser Aufgabe ist die Benennung entweder max2 oder max3.`,
      },
      {
        ...errorMissingParenthesesIfCondition,
      },
      {
        ...errorSemicolonAfterIfCondition,
      },
      {
        ...errorLogicalOperator,
      },
      {
        ...errorSwitchedCompareSymbol,
      },
      {
        ...errorUsageOfMathMax,
      },
      {
        ...errorMissingFunction,
        exerciseSpecificMessage: `Schreibe zwei Funktionen, die mehrmals aufgerufen werden können. Schreibe jeweils eine Funktion für max2 und max3. Die Syntax sieht so aus:
function name() {
  // code 
}
Ersetze name jeweils durch den Namen der Funktion.`,
      },
      {
        ...{
          ...errorConsoleLogInsteadOfReturn,
          condition: (...args) =>
            errorConsoleLogInsteadOfReturn.condition(...args, ["max2", "max3"]),
        },
      },
      {
        ...{
          ...errorMissingReturn,
          condition: (...args) =>
            errorMissingReturn.condition(...args, ["max2", "max3"]),
        },
      },
      {
        ...errorMissingIfElse,
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code und erweitere um weitere Bedingungen:
if (a > b) {
  // gebe den größeren Wert zurück
} else {
  // gebe den übrigen Wert zurück
}`,
      },
      {
        ...{
          ...errorIncorrectNumberOfParams,
          condition: (...args) =>
            errorIncorrectNumberOfParams.condition(...args, "max2", 2),
        },
        exerciseSpecificMessage: `Die Funktion max2 sollte zwei Parameter bekommen. So sollte der Funktionskopf von max2 aussehen:
function max2(a, b)
Du kannst natürlich die Namen der Parameter ändern und aussagekräftigere Bezeichnungen als a und b wählen.`,
      },
      {
        ...{
          ...errorIncorrectNumberOfParams,
          condition: (...args) =>
            errorIncorrectNumberOfParams.condition(...args, "max3", 3),
        },
        exerciseSpecificMessage: `Die Funktion max3 sollte drei Parameter bekommen. So sollte der Funktionskopf von max3 aussehen:
function max3(a, b, c)
Du kannst natürlich die Namen der Parameter ändern und aussagekräftigere Bezeichnungen als a, b und c wählen.`,
      },
      {
        ...{
          ...errorIncorrectNumberOfCallArguments,
          condition: (...args) =>
            errorIncorrectNumberOfCallArguments.condition(...args, "max2", 2),
        },
        exerciseSpecificMessage:
          "Für die Funktion function max2(a, b) {} sollte der Funktionsaufruf so aussehen: max2(1, 2). 1 und 2 sind dabei die Werte für die Parameter a und b eingesetzt werden. Die Anzahl der übergebenen Parameter muss dabei mit der Funktionsinitialisierung übereinstimmen, hier also genau zwei.",
      },
      {
        ...{
          ...errorIncorrectNumberOfCallArguments,
          condition: (...args) =>
            errorIncorrectNumberOfCallArguments.condition(...args, "max3", 3),
        },
        exerciseSpecificMessage:
          "Für die Funktion function max3(a, b, c) {} sollte der Funktionsaufruf so aussehen: max3(1, 2, 3). 1, 2 und 3 sind dabei die Werte für die Parameter a, b und c eingesetzt werden. Die Anzahl der übergebenen Parameter muss dabei mit der Funktionsinitialisierung übereinstimmen, hier also genau drei.",
      },
    ],
  },
]
