<script>
  import CodeEditor from "./CodeEditor.svelte"
  import { runUnitTest } from "../lib/tests"
  import { getDiagnostics } from "../lib/astlint"
  import { isEqual } from "lodash"

  export let title
  export let initialcode
  export let testCases
  export let misconceptions

  let code
  let consoleCode = ""
  let lintError
  let previousLintError
  let messageIndex = 0
  let showErrorMessage = false

  // TODO: weitere Erklärungen -> erkläre zusätzliche Prinzipien wie if-Bedingung etc.

  function updateCode(event) {
    code = event.detail.text
    if (lintError) {
      previousLintError = lintError
    }
    lintError = getDiagnostics(misconceptions, code)[0]
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
    const consoleLog = console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
      consoleCode = `${consoleCode}${msg}\n`
    }
    try {
      Function(code)
      /* +
          `const event = new Event('build');
// Dispatch the event.
const ed = document.getElementById("editor")
ed.dispatchEvent(event);`
      )()
      // Listen for the event.
      const ed = document.getElementById("editor")
      ed.addEventListener(
        "build",
        (e) => {
          console.log("event bubble")
        },
        false 
      ) */
    } catch (error) {
      console.log(error) // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }
  }

  function test() {
    let correct = runUnitTest(title, code, testCases)
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
    <div id="pop-up" class={lintError.severity == "error" ? "error" : "help"}>
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
    max-height: 100%;
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
    overflow-y: scroll;
    max-height: 70vh;
    height: 70vh;
  }
  #pop-up {
    grid-area: error;
    margin: 0;
    padding: 1em;
    color: white;
  }
  .error {
    background-color: #f23d3d;
  }
  .help {
    background-color: #2678bf;
  }
  #pop-up h4 {
    margin: 0;
  }
  #pop-up p {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  #action {
    grid-area: action;
  }
  p {
    white-space: pre-line;
  }
</style>
