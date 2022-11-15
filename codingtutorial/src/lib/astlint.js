// @ts-nocheck
//TODO: this is the current workaround to get rid of all errors regarding missing properties on nodes

import { parse } from "acorn";
import * as walk from "acorn-walk";

const errorStore = [];
let diagnostics = [];

export default (view) => {
  const ast = parse(view.state.doc, { ecmaVersion: "latest" });
  walk.fullAncestor(ast, (node, ancestors) => {
    switch (true) {
      case node.type == "ExpressionStatement" &&
        node.expression.callee.object.name == "console" &&
        node.expression.callee.property.name == "log" &&
        node.expression.arguments[0].value.includes("Auf Wiedersehen") &&
        ancestors[ancestors.length - 2].type !== "Program":
        errorConsoleLogNotInBody(node);
    }
  });
  return diagnostics;
};

export function clearLintDiagnostics() {
  diagnostics = [];
}

// console.log("Auf Wiedersehen"); is not a child of script
const errorConsoleLogNotInBody = (node) => {
  const messages = [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Code außerhalb von if-else wird immer ausgeführt.",
    'console.log("Auf Wiedersehen"); sollte nicht in if-else enthalten sein. Stattdessen wird diese danach ausgeführt.',
  ];
  const messageIndex = messages.findIndex((message) => {
    return !errorStore.find((el) => el.message === message);
  });
  const diagnosticElement = {
    from: node.start,
    to: node.end,
    severity: "warning",
    message: messages[messageIndex],
    actions: [
      {
        name: "Mehr Informationen.",
        apply(view) {
          // TODO: compute linter here to reload changes
          /* view.dispatch({
              state: { // update linter },
            });
            */
        },
      },
    ],
  };
  errorStore.push(diagnosticElement);
  diagnostics = diagnostics.filter((d) => Object.is(d, diagnosticElement));
  diagnostics.push(diagnosticElement);
};
