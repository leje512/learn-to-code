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
