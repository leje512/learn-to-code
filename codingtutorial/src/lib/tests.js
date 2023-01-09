export const runUnitTest = (title, code, testCases) => {
  switch (title) {
    case "if-else":
    case "if-else-if":
      return checkConsoleLog(code, testCases)
    case "function-max":
      return checkFunction(code, testCases)
  }
}

import { assert } from "chai"

function checkFunction(code, testCases) {
  try {
    const success = testCases.map(({ functionTest, functionResult }) => {
      const testCode = new Function(`${code} return ${functionTest}`)
      assert.equal(testCode(), functionResult, "test failed")
      return true
    })
    if (success.every((el) => el === true)) {
      return true
    }
  } catch (error) {
    return false
  }
}

function checkConsoleLog(code, testCases) {
  // override console.log to catch console.log results in a variable
  let codeOfConsoleLog = ""
  console.log = function (msg) {
    codeOfConsoleLog = `${codeOfConsoleLog}${msg}\n`
  }
  try {
    const success = testCases.map(
      ({ variableReplaceValue, consoleResult, variableName }) => {
        const testCode = variableName
          ? code.replace(
              RegExp(`(let|const|var)\\s?${variableName}\\s?=\\s?([0-9]+);*`),
              `const ${variableName} = ${variableReplaceValue};`
            )
          : code
        Function(testCode)()
        assert.equal(consoleResult, codeOfConsoleLog, "test failed")
        codeOfConsoleLog = ""
        return true
      }
    )
    if (success.every((el) => el === true)) {
      return true
    }
  } catch (error) {
    return false
  }
}
