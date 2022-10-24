<script>
  import { assert } from "chai"; // this import is needed to use assert from the testStrings

  export let testString;

  function runTest() {
    let result;
    try {
      eval(testString);
      result = true;
    } catch (error) {
      result = false;
    }
    document.body.style.background = result ? "green" : "red";
  }
</script>

<div id="test-wrapper">
  <button on:click={runTest}>test</button>
</div>
