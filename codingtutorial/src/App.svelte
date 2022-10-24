<script>
  import Sandbox from "./Sandbox.svelte";
  import Test from "./Test.svelte";

  const testString = "sum(1, 2);";
  const resultString = "3";
  let code;

  function handleCode(event) {
    code = event.detail.text;
  }
</script>

<main>
  <div id="task">
    Write a function sum with two parameters that returns the sum of both
    numbers
  </div>
  <Sandbox on:code={handleCode} />
  <div id="task">
    {testString} should return {resultString}
  </div>
  <Test {testString} {resultString} {code} />
</main>

<style>
  main {
    text-align: left;
  }
</style>
