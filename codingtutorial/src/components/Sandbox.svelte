<script>
  import CodeEditor from "./CodeEditor.svelte"
  import Tutor from "./Tutor.svelte"
  import { runUnitTest } from "../lib/tests"
  import { getDiagnostics } from "../lib/astlint"
  import { isEqual } from "lodash"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let title
  export let initialcode
  export let testCases
  export let misconceptions

  let code
  let consoleCode = ""
  let lintError
  let previousLintError
  let showErrorMessage = false
  let testPassed = false

  let showTutor = true
  let showTutorialMessage = true

  $: {
    showTutorialMessage = code && code.trim() === initialcode.trim()
  }

  // TODO: weitere Erklärungen -> erkläre zusätzliche Prinzipien wie if-Bedingung etc.

  function updateCode(event) {
    code = event.detail.text
    if (lintError) {
      previousLintError = lintError
    }
    lintError = getDiagnostics(misconceptions, code)[0]
    if (!isEqual(previousLintError, lintError)) {
      showTutor = true
      showErrorMessage = false
    }
  }

  function run() {
    consoleCode = ""
    const consoleLog = console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
      consoleCode = `${consoleCode}${msg}\n`
    }
    try {
      Function(code)()
    } catch (error) {
      console.log(error) // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }
  }

  function test() {
    testPassed = runUnitTest(title, code, testCases)
  }

  function next() {
    if (testPassed) {
      dispatch("next")
    }
    consoleCode = ""
    lintError = null
    previousLintError = null
    showErrorMessage = false
    testPassed = false
    showTutorialMessage = true
    showTutor = true
  }

  function closeModal() {
    showTutor = false
    showTutorialMessage = false
  }
</script>

<div id="sandbox">
  <div id="editor">
    <CodeEditor
      {initialcode}
      {showErrorMessage}
      error={lintError}
      on:edited={updateCode}
    />
  </div>
  <p id="console">
    {consoleCode}
  </p>
  {#if showTutor}
    <Tutor
      {showTutorialMessage}
      {lintError}
      on:showWhere={() => (showErrorMessage = true)}
      on:close={closeModal}
    />
  {/if}
  <div id="action">
    <button on:click={() => (showTutor = true)}>Tutor</button>
    <button on:click={run}>Run</button>
    <button class={testPassed ? "passed" : "failed"} on:click={test}
      >Test</button
    >
    <button disabled={!testPassed} on:click={next}>Nächste Aufgabe</button>
  </div>
</div>

<style>
  #sandbox {
    padding: 2em 0 0 0;
    display: grid;
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr);
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "editor console"
      ". action";
    grid-gap: 2em;
    max-height: 100%;
    min-height: 0;
  }
  #editor {
    grid-area: editor;
    overflow-y: auto;
  }
  #console {
    grid-area: console;
    background-color: black;
    color: white;
    margin: 0;
    padding: 0 5px;
    line-height: 1.4;
    overflow-y: auto;
  }
  p {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  #no-space-wrap {
    white-space: inherit;
  }
  #action {
    grid-area: action;
    display: flex;
    justify-content: space-evenly;
    gap: 1em;
  }
  #action button {
    flex: 1;
  }
  .passed {
    background-color: #b7d63a;
  }
  .failed {
    background-color: #f23d3d;
  }
</style>
