<script>
  import { assert } from "chai"; // this import is needed to use assert from the testStrings

  export let testString;
  export let resultString;
  export let code;

  function runTest() {
    let correct;
    try {
      const functionToTest = new Function(`${code} return ${testString}`);
      assert.equal(functionToTest(), resultString, "test failed");
      correct = true;
    } catch (error) {
      correct = false;
    }
    document.body.style.background = correct ? "green" : "red";
  }
</script>

<button on:click={runTest}>test</button>
