<script>
  import { onMount } from "svelte"
  import CodeEditor from "./CodeEditor.svelte"
  import { runUnitTest } from "../lib/tests"

  export let title
  export let initialcode

  let code
  let consoleCode = ""

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

  // TODO: add test function here to avoid having to run the code before you can test
</script>

<div id="sandbox">
  <div id="editor">
    <CodeEditor {initialcode} on:edited={updateCode} />
  </div>
  <p id="console">
    {consoleCode}
  </p>
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
      "action action";
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
  #action {
    grid-area: action;
  }
  p {
    white-space: pre-line;
  }
</style>
