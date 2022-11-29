import errorMessages from "./errorMessages"

export default [
  {
    title: "functionSum",
    task: "Write a function sum with two parameters that returns the sum of both numbers.",
    solution: "function sum(a, b) {\nreturn a + b;\n}",
    initialcode: "function sum(a, b) {\n//write your code here\n}\n\n\n\n\n",
    misconceptions: [],
  },
  {
    title: "if-else",
    task: `Es ist eine Punktzahl gegeben: 
<code>int punktzahl = 10</code>
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
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        type: "node",
        check: errorMessages.errorMissingParenthesesIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "node",
        check: errorMessages.errorSwitchedCompareSymbol,
        severity: "error",
        parseErrorCheck: "both",
      },
      {
        type: "node",
        check: errorMessages.errorSemicolonAfterIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "ast",
        check: errorMessages.errorMissingIfElse,
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code:
if (punkte mindestens 5) {
  // drucke "Bestanden"
} else {
  // drucke "Durchgefallen"
}`,
      },
      {
        type: "node",
        check: {
          ...errorMessages.errorConsoleLogNotInBody,
          condition: (...args) =>
            errorMessages.errorConsoleLogNotInBody.condition(
              ...args,
              "Auf Wiedersehen"
            ),
        },
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage:
          "console.log('Auf Wiedersehen'); sollte nicht in if-else enthalten sein. Stattdessen wird diese danach ausgeführt.",
      },
    ],
  },
  {
    title: "if-else-if",
    task: `Es ist eine Punktzahl gegeben: 
<code>int punktzahl = 10</code>
Schreiben Sie ein Programm, dass bei verschiedenen Punktständen ausgibt, wie die Klausur ausfällt:
<code>0-10: Durchgefallen
11-20: Naja
21-30: Mittelgut
31-40: Gut
41-50: Super</code>
Die Höchstpunktzahl sind 50 Punkte, deshalb wird bei mehr Punkten kein Text ausgegeben.`,
    solution: `let punkte = 41;

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
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        type: "node",
        check: errorMessages.errorMissingParenthesesIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "node",
        check: errorMessages.errorSwitchedCompareSymbol,
        severity: "error",
        parseErrorCheck: "both",
      },
      {
        type: "node",
        check: errorMessages.errorSemicolonAfterIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "ast",
        check: errorMessages.errorMissingIfElse,
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code und erweitere um weitere else if Bedingungen:
if (punkte <= 10) {
  // drucke Durchgefallen
} else if (punkte <=20) {
  // drucke Naja
}`,
      },
      {
        type: "node",
        check: errorMessages.errorStatementInBody,
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage:
          "Achte darauf, dass bei dieser Aufgabe kein console.log außerhalb von if oder else steht, da dieser sonst immer ausgeführt wird. Hier sollen aber nur ein bestimmter Text für jeden Fall angezeigt werden.",
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
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        type: "node",
        check: errorMessages.errorMissingFunctionKeyword,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "node",
        check: errorMessages.errorMissingFunctionName,
        severity: "error",
        parseErrorCheck: "parseError",
        exerciseSpecificMessage:
          "Zwischen dem Keyword function und den Funktionsparametern, also dem Teil in normalen Klammern, sollte der Name stehen: in dieser Aufgabe ist die Benennung entweder max2 oder max3.",
      },
      {
        type: "node",
        check: errorMessages.errorLogicalOperator,
        severity: "error",
        parseErrorCheck: "regular",
      },
      {
        type: "node",
        check: errorMessages.errorUsageOfMathMax,
        severity: "error",
        parseErrorCheck: "regular",
      },
      {
        type: "node",
        check: errorMessages.errorMissingParenthesesIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "node",
        check: errorMessages.errorSwitchedCompareSymbol,
        severity: "error",
        parseErrorCheck: "both",
      },
      {
        type: "node",
        check: errorMessages.errorSemicolonAfterIfCondition,
        severity: "error",
        parseErrorCheck: "parseError",
      },
      {
        type: "node",
        check: {
          ...errorMessages.errorConsoleLogInsteadOfReturn,
          condition: (...args) =>
            errorMessages.errorConsoleLogInsteadOfReturn.condition(...args, [
              "max2",
              "max3",
            ]),
        },
        severity: "hint",
        parseErrorCheck: "regular",
      },
      {
        type: "node",
        check: {
          ...errorMessages.errorMissingReturn,
          condition: (...args) =>
            errorMessages.errorMissingReturn.condition(...args, [
              "max2",
              "max3",
            ]),
        },
        severity: "hint",
        parseErrorCheck: "regular",
      },
      {
        type: "ast",
        check: errorMessages.errorMissingIfElse,
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage: `Ergänze folgende Syntax um den richtigen Code und erweitere um weitere Bedingungen:
if (a > b) {
  // gebe den größeren Wert zurück
} else {
  // gebe den übrigen Wert zurück
}`,
      },
      {
        type: "node",
        check: {
          ...errorMessages.errorCorrectNumberOfParams,
          condition: (...args) =>
            errorMessages.errorCorrectNumberOfParams.condition(
              ...args,
              "max2",
              2
            ),
        },
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage: `Die Funktion max2 sollte zwei Parameter bekommen. So sollte der Funktionskopf von max2 aussehen:
function max2(a, b)
Du kannst natürlich die Namen der Parameter ändern und aussagekräftigere Bezeichnungen als a und b wählen.`,
      },
      {
        type: "node",
        check: {
          ...errorMessages.errorCorrectNumberOfParams,
          condition: (...args) =>
            errorMessages.errorCorrectNumberOfParams.condition(
              ...args,
              "max3",
              3
            ),
        },
        severity: "hint",
        parseErrorCheck: "regular",
        exerciseSpecificMessage: `Die Funktion max3 sollte drei Parameter bekommen. So sollte der Funktionskopf von max3 aussehen:
function max3(a, b, c)
Du kannst natürlich die Namen der Parameter ändern und aussagekräftigere Bezeichnungen als a, b und c wählen.`,
      },
    ],
  },
]
