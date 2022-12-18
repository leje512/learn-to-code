<script>
  import CodeEditor from "./CodeEditor.svelte"
  import DraggableModal from "./DraggableModal.svelte"
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
  let messageIndex = 0
  let showErrorMessage = false
  let testPassed = false
  let showTutor = true

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
      messageIndex = 0
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
  }

  function showWhere() {
    showErrorMessage = true
  }

  function moreInformation() {
    if (messageIndex < lintError.messages.length - 1) {
      messageIndex++
    }
  }

  function getBackgroundColor(severity) {
    switch (severity) {
      case "error":
        return "#f23d3d"
      case "hint":
        return "#2678bf"
      case "praise":
        return "#b7d63a"
      default:
        return "white"
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
  {#if showTutor}
    <p>Tutor</p>
    {#if code && code.trim() === initialcode.trim()}
      <DraggableModal
        backgroundColor={getBackgroundColor("praise")}
        on:close={() => (showTutor = false)}
      >
        <span slot="title">Hallo!</span>
        <p slot="content" id="no-space-wrap">
          Ich bin dein Tutor. Durch Tipps will ich dir helfen, das Programmieren
          besser zu verstehen. Drücke auf Wo, um den Codeausschnitt zu
          markieren, für den der Tipp gedacht ist. Oder drücke auf Weitere
          Informationen, um dir genauere Infos und Anleitungen zur Umsetzung zu
          holen. Los geht's!
        </p>
        <div class="actions" slot="actions">
          <button disabled>Wo?</button>
          <button disabled>Weitere Informationen</button>
        </div>
      </DraggableModal>
    {:else if lintError}
      <DraggableModal
        backgroundColor={getBackgroundColor(lintError.severity)}
        on:close={() => (showTutor = false)}
      >
        <span slot="title"
          >{#if lintError.severity !== "praise"}Achtung!{:else}Weiter so!{/if}</span
        >
        <p slot="content">{lintError.messages[messageIndex]}</p>
        <div class="actions" slot="actions">
          {#if lintError.severity !== "praise"}
            <button on:click={showWhere}>Wo?</button>
          {/if}
          {#if messageIndex < lintError.messages.length - 1}
            <button on:click={moreInformation}>Weitere Informationen</button>
          {/if}
        </div>
      </DraggableModal>
    {/if}
  {/if}
  <div id="action">
    <button on:click={() => (showTutor = true)}>Tutor</button>
    <button on:click={run}>Run</button>
    <button on:click={test}>Test</button>
    <button disabled={!testPassed} on:click={next}>Nächste Aufgabe</button>
  </div>
</div>

<style>
  #sandbox {
    padding: 2em 0;
    display: grid;
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr);
    grid-template-areas:
      "editor console"
      "editor console"
      "action .";
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
  }
  p {
    white-space: pre-line;
  }
</style>
