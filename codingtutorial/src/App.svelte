<script>
  import Sandbox from "./Sandbox.svelte";
  import Mocha from "./Test.svelte";

  const testString = `assert.equal(sum(1, 2), 3, "test failed");`;
</script>

<main>
  <!--div id="task">
    Write a function sum with two parameters that returns the sum of both
    numbers
  </div-->
  <!--Sandbox /-->
  {testString}
  <Mocha {testString} />
</main>

<style>
  main {
    text-align: left;
  }
</style>
