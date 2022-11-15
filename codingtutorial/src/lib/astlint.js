import { parse } from "acorn";
import * as walk from "acorn-walk";

const errorStore = [];
let diagnostics = [];

export default (view) => {
  const ast = parse(view.state.doc, { ecmaVersion: "latest" });
  walk.fullAncestor(ast, (node, ancestors) => {
    switch (true) {
      case node.type == "ExpressionStatement":
        ancestors.forEach((anc) => console.log("anc", anc));
        errorConsoleLogNotInBody(node);
    }
  });
  return diagnostics;
};

const errorConsoleLogNotInBody = (node) => {
  const messages = [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Level 2",
    "Level 3",
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
          errorStore.push(diagnosticElement);
          // TODO: compute linter here to reload changes
          /* view.dispatch({
              state: { // update linter },
            });
            */
        },
      },
    ],
  };
  diagnostics = diagnostics.filter((d) => Object.is(d, diagnosticElement));
  diagnostics.push(diagnosticElement);
};
