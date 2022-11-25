<script>
  import Sandbox from "./components/Sandbox.svelte"

  import exercises from "./lib/exercises"
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
    {@html exercises[count].task}
  </div>
  <Sandbox
    title={exercises[count].title}
    initialcode={exercises[count].initialcode}
  />
</main>

<style>
  main {
    text-align: left;
  }
  .exercise-action {
    display: flex;
    justify-content: space-between;
    padding: 0 0 20px 0;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:disabled:hover {
    border: none;
  }
  #task {
    display: block;
    white-space: pre-wrap;
  }
  :global(code) {
    background: lightgrey;
    font-family: monospace;
  }
  :global(code.terminal) {
    background: black;
    color: white;
    font-family: monospace;
  }
</style>
