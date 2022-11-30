export const runUnitTest = (title, code) => {
  switch (title) {
    case "functionSum":
      return checkFunctionSum(code)
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

// TODO: proxy or string concatenation to change variables
// -> rather use const and show Usererror if they try to change this const

// TODO: try to use proxy to get consoleLogs
// -> console.log should stay but get a new function depending on context (testing context vs. sandbox context)

// new knowledge: it is possible to dispatch events in function, so maybe adding events to the code could be enough
// eg. adding event via proxy and listening to event

// or maybe rather Object.prototype to add new functions depending on context
