<script>
  import { createEventDispatcher } from "svelte"
  import { isEqual } from "lodash"
  import CodeEditor from "./CodeEditor.svelte"
  import Tutor from "./Tutor.svelte"
  import DraggableModal from "./DraggableModal.svelte"
  import Solution from "./Solution.svelte"
  import TutorialModal from "./TutorialModal.svelte"
  import { runUnitTest } from "../lib/tests.js"
  import { getDiagnostics } from "../diagnosis/astlint.js"

  const dispatch = createEventDispatcher()

  export let title
  export let initialcode
  export let testCases
  export let misconceptions
  export let solution

  let code
  let consoleCode = ""
  let tutorContent
  let previousTutorContent
  let remainingProblems
  let showHighlighting = false
  let testPassed = false
  let unlockedNext = false

  let showTutorialModal = true
  let showTutorModal = false
  let showTestModal = false
  let showSolutionModal = false

  function updateCode(event) {
    code = event.detail.text
    remainingProblems = getDiagnostics(misconceptions, code)
  }

  $: {
    if (remainingProblems) {
      updateTutorContent()
    }
  }

  let timerId
  function updateTutorContent() {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      if (tutorContent) {
        previousTutorContent = tutorContent
      }
      tutorContent = remainingProblems[0]

      if (!isEqual(previousTutorContent, tutorContent) && !showTutorialModal) {
        showTutorModal = true
        showHighlighting = false
      }
    }, 3000)
  }

  function run() {
    consoleCode = ""

    // override console.log only for the run of the function
    const consoleLog = console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
      consoleCode = `${consoleCode}${msg}\n`
    }
    try {
      Function(code)()
      testCode()
    } catch (error) {
      console.log(error) // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }

    // reset console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
    }
  }

  function test() {
    showTestModal = true
    testCode()
  }

  function testCode() {
    testPassed = runUnitTest(title, code, testCases)
    if (remainingProblems.length === 0 && testPassed) {
      unlockedNext = true
    }
  }

  function next() {
    if (unlockedNext) {
      dispatch("next")
      consoleCode = ""
      tutorContent = null
      previousTutorContent = null
      remainingProblems = []
      showHighlighting = false
      testPassed = false
      unlockedNext = false

      showTutorModal = true
      showTestModal = false
    }
  }

  function closeTutorialModal() {
    showTutorialModal = false
    showHighlighting = false
  }

  function closeTutorModal() {
    showTutorModal = false
  }

  function openSolution() {
    const response = confirm(
      "Willst du dir wirklich die Lösung anzeigen lassen? Überprüfe davor nochmal die Aufgabenstellung und deinen Code."
    )

    if (response) {
      showSolutionModal = true
    }
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
      {showHighlighting}
      error={tutorContent}
      on:edited={updateCode}
    />
  </div>
  <p class="formatted-p" id="console">
    {consoleCode}
  </p>
  <div id="action">
    <button on:click={() => (showTutorModal = true)}>Tutor</button>
    <button on:click={run}>Run</button>
    <button class={testPassed ? "passed" : "failed"} on:click={test}
      >Test</button
    >
    <button on:click={openSolution}>Lösung</button>
    <button disabled={!unlockedNext} on:click={next}>Nächste Aufgabe</button>
  </div>
  {#if showTutorialModal}
    <div class="modal">
      <TutorialModal
        on:showWhere={() => (showHighlighting = true)}
        on:close={closeTutorialModal}
      />
    </div>
  {/if}
  {#if showTutorModal}
    <div class="modal">
      <Tutor
        {tutorContent}
        on:showWhere={() => (showHighlighting = true)}
        on:close={closeTutorModal}
      />
    </div>
  {/if}
  {#if showTestModal}
    <div class="modal">
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
              Es gibt aber noch ein paar Probleme in deinem Code. Nutze den
              Tutor, um alle Probleme zu beheben.
            {/if}
          {:else}
            Überprüfe die Aufgabenstellung und nutze den Tutor, um zum richtigen
            Ergebnis zu gelangen. Achte darauf, alle Anforderungen zu erfüllen
            und keine Logikfehler zu machen.
          {/if}
        </p>
        <div class="actions" slot="actions">
          {#if unlockedNext}
            <button on:click={next}>Nächste Aufgabe</button>
          {/if}
        </div>
      </DraggableModal>
    </div>
  {/if}
  {#if showSolutionModal}
    <Solution {solution} on:close={() => (showSolutionModal = false)} />
  {/if}
</div>

<style>
  #sandbox {
    padding: 2em 0 0 0;
    display: grid;
    grid-template-columns: minmax(250px, 2fr) minmax(250px, 1fr);
    grid-template-rows: auto 2em 1fr 0px;
    grid-template-areas:
      "editor console"
      ". ."
      "action ."
      "modal modal";
    max-height: 100%;
    min-height: 0;
  }
  #editor {
    grid-area: editor;
    overflow-y: auto;
    margin-right: 2em;
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

  #action {
    grid-area: action;
    display: flex;
    justify-content: space-evenly;
    gap: 1em;
  }
  .modal {
    grid-area: modal;
  }
  #action button {
    flex: 1;
  }
  .formatted-p {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .passed {
    background-color: #b7d63a;
  }
  .failed {
    background-color: #f23d3d;
  }
</style>
