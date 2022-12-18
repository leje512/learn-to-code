<script>
  import CodeEditor from "./CodeEditor.svelte"
  import Tutor from "./Tutor.svelte"
  import { runUnitTest } from "../lib/tests"
  import { getDiagnostics } from "../lib/astlint"
  import { isEqual } from "lodash"
  import { createEventDispatcher } from "svelte"
  import DraggableModal from "./DraggableModal.svelte"

  const dispatch = createEventDispatcher()

  export let title
  export let initialcode
  export let testCases
  export let misconceptions

  let code
  let consoleCode = ""
  let lintError
  let previousLintError
  let remainingProblems
  let showErrorMessage = false
  let testPassed = false
  let unlockedNext = false

  let showTutor = true
  let showTutorialMessage = true
  let showTestModal = false

  $: {
    showTutorialMessage = code && code.trim() === initialcode.trim()
  }

  // TODO: weitere Erklärungen -> erkläre zusätzliche Prinzipien wie if-Bedingung etc.

  let timerId
  function updateCode(event) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      code = event.detail.text
      if (lintError) {
        previousLintError = lintError
      }
      remainingProblems = getDiagnostics(misconceptions, code)
      if (!isEqual(previousLintError, lintError)) {
        showTutor = true
        showErrorMessage = false
      }
    }, 1500)
  }

  $: {
    if (remainingProblems) {
      lintError = remainingProblems[0]
      showTutor = true
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
    showTestModal = true
    testPassed = runUnitTest(title, code, testCases)
    if (remainingProblems.length === 0 && testPassed) {
      unlockedNext = true
    }
  }

  function next() {
    if (unlockedNext) {
      dispatch("next")
      consoleCode = ""
      lintError = null
      previousLintError = null
      showErrorMessage = false
      testPassed = false
      showTutorialMessage = true
      showTutor = true
      unlockedNext = false
    }
  }

  function closeTutorModal() {
    showTutor = false
    showTutorialMessage = false
  }

  function getBackgroundColor() {
    if (testPassed && unlockedNext) {
      return "#b7d63a"
    } else if (testPassed) {
      return "#faea49"
    }
    return "#f23d3d"
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
  <p class="formatted-p" id="console">
    {consoleCode}
  </p>
  {#if showTutor}
    <Tutor
      {showTutorialMessage}
      {lintError}
      on:showWhere={() => (showErrorMessage = true)}
      on:close={closeTutorModal}
    />
  {/if}
  <div id="action">
    <button on:click={() => (showTutor = true)}>Tutor</button>
    <button on:click={run}>Run</button>
    <button class={testPassed ? "passed" : "failed"} on:click={test}
      >Test</button
    >
    <button disabled={!unlockedNext} on:click={next}>Nächste Aufgabe</button>
  </div>
  {#if showTestModal}
    <DraggableModal
      backgroundColor={getBackgroundColor()}
      backgroundUsable={false}
      minimizable={false}
      on:close={() => (showTestModal = false)}
    >
      <span slot="title"
        >{#if testPassed}Super!{:else}Noch nicht ganz.{/if}</span
      >
      <p slot="content">
        {#if testPassed}
          Dein Code liefert das gewünschte Ergebnis.
          {#if remainingProblems.length}
            Es gibt aber noch ein paar Probleme in deinem Code. Nutze den Tutor,
            um alle Probleme zu beheben.
          {/if}
        {:else}
          Überprüfe die Aufgabenstellung und nutze den Tutor, um zum richtigen
          Ergebnis zu gelangen.
        {/if}
      </p>
    </DraggableModal>
  {/if}
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
  .formatted-p {
    white-space: pre-wrap;
    word-wrap: break-word;
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
