<script>
  import Sandbox from "./components/Sandbox.svelte";

  import exercises from "./exercises";
  let count = 0;

  function incrementCount() {
    if (count < exercises.length - 1) {
      count++;
    }
  }

  function decreaseCount() {
    if (count > 0) {
      count--;
    }
  }
</script>

<main>
  <button on:click={decreaseCount}>back</button>
  <button on:click={incrementCount}>next</button>
  <div id="task">
    {exercises[count].task}
  </div>
  <Sandbox
    testString={exercises[count].teststring}
    resultString={exercises[count].resultstring}
    initialcode={exercises[count].initialcode}
  />
  <div id="task">
    {exercises[count].teststring} should return {exercises[count].resultstring}
  </div>
</main>

<style>
  main {
    text-align: left;
  }
</style>
