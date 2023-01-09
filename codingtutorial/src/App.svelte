<script>
  import Sandbox from "./components/Sandbox.svelte"

  import exercises from "./lib/exercises"
  let count = 0

  function incrementCount() {
    if (count < exercises.length - 1) {
      count++
    }
  }
</script>

<main>
  <div id="task">
    {@html exercises[count].task}
  </div>
  <Sandbox
    title={exercises[count].title}
    initialcode={exercises[count].initialcode}
    testCases={exercises[count].testCases}
    misconceptions={exercises[count].misconceptions}
    solution={exercises[count].solution}
    on:next={incrementCount}
  />
</main>

<style>
  main {
    margin: 0;
    padding: 2em;
    max-height: 100vh;
    max-width: 100vw;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  #task {
    display: block;
    white-space: pre-wrap;
  }
</style>
