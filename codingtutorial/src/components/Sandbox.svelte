<script>
  import { onMount } from "svelte"
  import CodeEditor from "./CodeEditor.svelte"
  import { runUnitTest } from "../lib/tests"
  import { getDiagnostics } from "../lib/astlint"
  import { isEqual } from "lodash"

  export let title
  export let initialcode

  let code
  let consoleCode = ""
  let lintError
  let previousLintError
  let messageIndex = 0
  let showErrorMessage = false

  // TODO: zeige Fehler -> markiert Fehler im Code
  // TODO: mehr Infos -> nächstes Level
  // TODO: weitere Erklärungen -> erkläre zusätzliche Prinzipien wie if-Bedingung etc.

  onMount(() => {
    // override console.log to show message in div
    const consoleLog = console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
      consoleCode = `${consoleCode}${msg}\n`
    }
  })

  function updateCode(event) {
    code = event.detail.text
    if (lintError) {
      previousLintError = lintError
    }
    lintError = getDiagnostics(code)[0]
    if (!isEqual(previousLintError, lintError)) {
      showErrorMessage = false
      messageIndex = 0
    }
  }

  function logCode() {
    console.log(code)
  }

  function run() {
    consoleCode = ""
    try {
      Function(code)()
    } catch (error) {
      console.log(error) // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }
  }

  function test() {
    let correct = runUnitTest(title, code)
    document.body.style.background = correct ? "green" : "red"
  }

  function showWhere() {
    showErrorMessage = true
  }

  function moreInformation() {
    if (messageIndex < lintError.messages.length - 1) {
      messageIndex++
    }
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
  {#if lintError}
    <div id="error">
      <h4>Achtung!</h4>
      <p>{lintError.messages[messageIndex]}</p>
      <button on:click={showWhere}>Wo?</button>
      {#if messageIndex < lintError.messages.length - 1}
        <button on:click={moreInformation}>Mehr Informationen</button>
      {/if}
    </div>
  {/if}
  <div id="action">
    <button on:click={logCode}>log code</button>
    <button on:click={run}>run code</button>
    <button on:click={test}>test</button>
  </div>
</div>

<style>
  #sandbox {
    padding: 2em 0;
    display: grid;
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr);
    grid-template-areas:
      "editor console"
      "error action";
    grid-gap: 2em;
  }
  #editor {
    grid-area: editor;
  }
  #console {
    grid-area: console;
    background-color: black;
    color: white;
    margin: 0;
    padding: 0 5px;
    line-height: 1.4;
  }
  #error {
    grid-area: error;
    background-color: #c41d3f;
    margin: 0;
    padding: 1em;
    color: white;
  }
  #error h4 {
    margin: 0;
  }
  #action {
    grid-area: action;
  }
  p {
    white-space: pre-line;
  }
</style>
