import { syntaxTree } from "@codemirror/language";
import { linter } from "@codemirror/lint";
import { parse } from "acorn";
import * as walk from "acorn-walk";

const errorStore = [];
const diagnostics = [];

const customLinter = (view) => {
  const ast = parse(view.state.doc, { ecmaVersion: "latest" });
  console.log("ast", ast);
  console.log(
    "token",
    walk.simple(ast, {
      Literal(node) {
        console.log(`Found a literal: ${node.type}`);
      },
    })
  );
  /*  switch (true) {
        case node.name == "ExpressionStatement" &&
          node.node.parent.name == "Script":
          errorConsoleLogNotInBody(node);
      }
    });*/
  return diagnostics;
};

export default linter(customLinter);

const errorConsoleLogNotInBody = (node) => {
  const messages = [
    "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
    "Level 2",
    "Level 3",
  ];
  const currentMessage = messages.findIndex((message) => {
    return !errorStore.find((el) => el.message === message);
  });
  const diagnosticElement = {
    from: node.from,
    to: node.to,
    severity: "warning",
    message: messages[currentMessage],
    actions: [
      {
        name: "Mehr Informationen.",
        apply(view) {
          errorStore.push(diagnosticElement);
          diagnostics.splice(
            0,
            diagnostics.findIndex((d) => d.message === messages[currentMessage])
          );
          // TODO: compute linter here to reload changes
          /*
          view.dispatch({
            state: { extensions: [linter(customLinter)] },
          });*/
        },
      },
    ],
  };
  diagnostics.push(diagnosticElement);
};
