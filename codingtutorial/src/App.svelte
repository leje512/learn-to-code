<script>
  import Sandbox from "./components/Sandbox.svelte"

  import exercises from "./exercises"
  let count = 0

  function incrementCount() {
    if (count < exercises.length - 1) {
      count++
    }
  }

  function decreaseCount() {
    if (count > 0) {
      count--
    }
  }
</script>

<main>
  <div class="exercise-action">
    <button disabled={count <= 0} on:click={decreaseCount}>back</button>
    <button disabled={count >= exercises.length - 1} on:click={incrementCount}
      >next</button
    >
  </div>
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
  .exercise-action {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:disabled:hover {
    border: none;
  }
</style>
