<script>
  import Sandbox from "./Sandbox.svelte";

  const testString = "sum(1, 2);";
  const resultString = "3";
  const initialcode =
    "function sum(a, b) {\n//write your code here\n}\n\n\n\n\n";
</script>

<main>
  <div id="task">
    Write a function sum with two parameters that returns the sum of both
    numbers
  </div>
  <Sandbox {testString} {resultString} {initialcode} />
  <div id="task">
    {testString} should return {resultString}
  </div>
</main>

<style>
  main {
    text-align: left;
  }
</style>
