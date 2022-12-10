export const runUnitTest = (title, code, testCases) => {
  switch (title) {
    case "functionSum":
      return checkFunctionSum(code)
    case "if-else":
    case "if-else-if":
      return checkConsoleLog(code, testCases)
  }
}

import { assert } from "chai"

function checkFunctionSum(code) {
  try {
    const functionToTest = new Function(`${code} return sum(1, 2)`)
    assert.equal(functionToTest(), 3, "test failed")
    return true
  } catch (error) {
    return false
  }
}

function checkConsoleLog(code, testCases) {
  // catch console.log results in a variable
  let consoleCode = ""
  const consoleLog = console.log
  console.log = function (msg) {
    consoleLog.apply(console, arguments)
    consoleCode = `${consoleCode}${msg}\n`
  }
  try {
    const success = testCases.map(({ value, consoleResult, variableName }) => {
      const testCode = variableName
        ? code.replace(
            RegExp(`(let|const|var)\\s?${variableName}\\s?=\\s?([0-9]+);*`),
            `const ${variableName} = ${value};`
          )
        : code
      Function(testCode)()
      assert.equal(consoleResult, consoleCode, "test failed")
      consoleCode = ""
      return true
    })
    if (success.every((el) => el === true)) {
      return true
    }
  } catch (error) {
    // TODO: delete for production
    console.log("test did not match", error)
    return false
  }
}

// TODO: proxy or string concatenation to change variables
// -> rather use const and show Usererror if they try to change this const

// new knowledge: it is possible to dispatch events in function, so maybe adding events to the code could be enough
// eg. adding event via proxy and listening to event

// or maybe rather Object.prototype to add new functions depending on context
// https://stackoverflow.com/questions/13472188/enhance-function-prototype-to-call-a-given-function-before-execution-itself
