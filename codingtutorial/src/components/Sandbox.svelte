<script>
  import { onMount } from "svelte";
  import CodeEditor from "./CodeEditor.svelte";
  import Test from "./Test.svelte";

  export let testString;
  export let resultString;
  export let initialcode;

  let code;
  let consoleCode = "";

  onMount(() => {
    // override console.log to show message in div
    const consoleLog = console.log;
    console.log = function (msg) {
      consoleLog.apply(console, arguments);
      consoleCode = `${consoleCode}${msg}\n`;
    };
  });

  function updateCode(event) {
    code = event.detail.text;
  }

  function logCode() {
    console.log(code);
  }

  function run() {
    consoleCode = "";
    try {
      Function(code)();
    } catch (error) {
      console.log(error); // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }
  }

  // TODO: add test function here to avoid having to run the code before you can test
</script>

<div id="sandbox">
  <button on:click={logCode}>log code</button>
  <button on:click={run}>run code</button>
  <CodeEditor {initialcode} on:edited={updateCode} />
  <p id="console">
    {consoleCode}
  </p>
  <Test {testString} {resultString} {code} />
</div>

<style>
  p {
    white-space: pre-line;
  }
</style>
