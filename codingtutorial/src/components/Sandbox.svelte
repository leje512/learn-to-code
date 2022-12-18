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
  let showTutorialMessage = true
  let showTutor = true

  let modalLeft
  let modalTop

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
    consoleCode = ""
    lintError = null
    previousLintError = null
    messageIndex = 0
    showErrorMessage = false
    testPassed = false
    showTutorialMessage = true
    showTutor = true
  }

  function showWhere() {
    showErrorMessage = true
  }

  function moreInformation() {
    if (messageIndex < lintError.messages.length - 1) {
      messageIndex++
    }
  }

  function getBackgroundColor(lintError) {
    if (!lintError) {
      return "#b7d63a"
    }
    switch (lintError.severity) {
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

  function closeModal() {
    showTutor = false
    showTutorialMessage = false
  }

  function updateModalPosition(event) {
    modalLeft = event.detail.left
    modalTop = event.detail.top
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
    <DraggableModal
      backgroundColor={showTutorialMessage
        ? getBackgroundColor()
        : getBackgroundColor(lintError)}
      left={modalLeft}
      top={modalTop}
      on:close={closeModal}
      on:move={updateModalPosition}
    >
      <span slot="title"
        >{#if showTutorialMessage}Hallo!{:else if lintError && lintError.severity !== "praise"}Achtung!{:else}Weiter
          so!{/if}</span
      >
      <p slot="content" id={showTutorialMessage ? "no-space-wrap" : ""}>
        {#if showTutorialMessage}
          Ich bin dein Tutor. Durch Tipps will ich dir helfen, das Programmieren
          besser zu verstehen. Drücke auf Wo, um den Codeausschnitt zu
          markieren, für den der Tipp gedacht ist. Oder drücke auf Weitere
          Informationen, um dir genauere Infos und Anleitungen zur Umsetzung zu
          holen. Los geht's!
        {:else if lintError}{lintError.messages[messageIndex]}
        {/if}
      </p>
      <div class="actions" slot="actions">
        {#if lintError && lintError.severity !== "praise"}
          <button disabled={showTutorialMessage} on:click={showWhere}
            >Wo?</button
          >
        {/if}
        {#if lintError && messageIndex < lintError.messages.length - 1}
          <button disabled={showTutorialMessage} on:click={moreInformation}
            >Weitere Informationen</button
          >
        {/if}
      </div>
    </DraggableModal>
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
  .passed {
    background-color: #b7d63a;
  }
  .failed {
    background-color: #f23d3d;
  }
</style>
