<script>
  import { onMount } from "svelte";
  import { transform } from "@babel/standalone";
  import CodeEditor from "./CodeEditor.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let code;

  onMount(() => {
    const el = document
      .getElementById("codeeditor")
      .addEventListener("codeedited", (e) => (code = e.detail)); // TODO: get rid of error here via typescript?: should be customevent not event
    const frame = document.getElementsByTagName("iframe")[0];
    frame.addEventListener("eval", (event) => {
      const code = event.detail;
      console.log("this", this); // this is undefined here
      console.log("window", window); // same as before
      Function(code)(); // so this will probably still run in the same context
    });
  });

  function logCode() {
    console.log(code);
  }

  function compileCode() {
    const transformedCode = transform(code, { presets: ["env"] }).code;
    dispatch("code", {
      text: transformedCode,
    });
  }

  function run() {
    const transformedCode = transform(code, { presets: ["env"] }).code;
    const evaluateCode = new CustomEvent("eval", {
      detail: transformedCode,
    });
    const frame = document.getElementsByTagName("iframe")[0];
    frame.dispatchEvent(evaluateCode);
    console.log("this", this); // button
    console.log("sframe", frame);
    console.log("swindow", window); // window context
  }
</script>

<div id="sandbox">
  <button on:click={logCode}>log code</button>
  <button on:click={compileCode}>compile code</button>
  <button on:click={run}>run</button>
  <iframe
    sandbox="allow-scripts allow-same-origin"
    title="iframe to compile code safely"
  />
  <CodeEditor />
</div>

<style>
  iframe {
    display: none;
  }
</style>
