<script>
  import { onMount } from "svelte";
  import { transform } from "@babel/standalone";
  import CodeEditor from "./CodeEditor.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let code;
  let consoleCode;

  onMount(() => {
    // eventListener to get editor content
    const el = document
      .getElementById("codeeditor")
      .addEventListener("codeedited", (e) => (code = e.detail)); // TODO: get rid of error here via typescript?: should be customevent not event

    // override console.log to show message in div
    const consoleLog = console.log;
    console.log = function (msg) {
      consoleLog.apply(console, arguments);
      consoleCode += msg;
    };
  });

  function logCode() {
    console.log(code);
  }

  function run() {
    const transformedCode = transform(code, { presets: ["env"] }).code;
    dispatch("code", {
      text: transformedCode,
    });
    consoleCode = "";
  }
</script>

<div id="sandbox">
  <button on:click={logCode}>log code</button>
  <button on:click={run}>run code</button>
  <CodeEditor />
  <div id="console">
    {consoleCode}
  </div>
</div>
