export function getLineOfCodeByLineNumber(code, lineNumber) {
  const allLines = code.split("\n")
  const line = allLines.slice(0, lineNumber).join("\n")
  return line
}

export function getLineOfCodeByStart(code, start) {
  const codeTillStart = code.slice(0, start)
  const lineNumber = codeTillStart.split("\n").length
  return lineNumber
}
