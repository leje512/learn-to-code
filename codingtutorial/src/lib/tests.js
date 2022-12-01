export const runUnitTest = (title, code) => {
  switch (title) {
    case "functionSum":
      return checkFunctionSum(code)
    case "if-else":
      return checkIfElse(code)
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

function checkIfElse(code) {
  let consoleCode = ""
  const consoleLog = console.log
  console.log = function (msg) {
    consoleLog.apply(console, arguments)
    consoleCode = `${consoleCode}${msg}\n`
  }
  const testCases = [
    {
      variableName: "punkte",
      value: 4,
      consoleResult: "Leider durchgefallen.\nAuf Wiedersehen.\n",
    },
    {
      variableName: "punkte",
      value: 5,
      consoleResult: "Bestanden.\nAuf Wiedersehen.\n",
    },
    {
      variableName: "punkte",
      value: 6,
      consoleResult: "Bestanden.\nAuf Wiedersehen.\n",
    },
  ]
  try {
    code = code.replace("let punkte = 10;", "")
    const success = testCases.map(({ value, consoleResult }) => {
      const testCode = `const punkte = ${value};` + code
      Function(testCode)()
      assert.equal(consoleResult, consoleCode, "test failed")
      consoleCode = ""
      return true
    })
    if (success.every((el) => el === true)) {
      return true
    }
  } catch (error) {
    console.log("checkIfElse error", error)
    return false
  }
}

// TODO: proxy or string concatenation to change variables
// -> rather use const and show Usererror if they try to change this const

// TODO: try to use proxy to get consoleLogs
// -> console.log should stay but get a new function depending on context (testing context vs. sandbox context)

// new knowledge: it is possible to dispatch events in function, so maybe adding events to the code could be enough
// eg. adding event via proxy and listening to event

// or maybe rather Object.prototype to add new functions depending on context
// https://stackoverflow.com/questions/13472188/enhance-function-prototype-to-call-a-given-function-before-execution-itself
