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
    task: `Sie haben eine Punktzahl gegeben: 
<code>int punktzahl = 10</code>
Schreiben Sie ein Programm, dass bei einer Punktzahl von mindestens 5 ausgibt:
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
    initialcode: `let punkte = 10;

if (punkte >= 5) {
  console.log("Bestanden.");
  console.log("Auf Wiedersehen.");
} else {
  console.log("Leider durchgefallen.");
  console.log("Auf Wiedersehen.");
}`,
    // misconceptions are to be ranked by priority -> from general to specific
    misconceptions: [
      {
        type: "node",
        check: errorMessages.errorSwitchedCompareSymbol,
        severity: "error",
      },
      {
        type: "node",
        check: errorMessages.errorSemicolonAfterIfCondition,
        severity: "error",
      },
      {
        type: "ast",
        check: errorMessages.errorMissingIfElse,
        severity: "hint",
      },
      {
        type: "node",
        check: errorMessages.errorConsoleLogNotInBody,
        severity: "hint",
      },
    ],
  },
]
