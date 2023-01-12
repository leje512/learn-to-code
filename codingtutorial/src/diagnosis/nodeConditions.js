const isConsoleLog = (node) => {
  return (
    node.type == "ExpressionStatement" &&
    node.expression &&
    node.expression.callee &&
    node.expression.callee.object &&
    node.expression.callee.property &&
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

export {
  isConsoleLog,
  consoleLogIncludesText,
  isIfStatement,
  isElseOrElseIfStatement,
  isFunctionDeclaration,
  isFunctionCall,
}
