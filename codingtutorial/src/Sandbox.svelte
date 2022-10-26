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
    try {
      Function(code)();
    } catch(error) {
      // TODO: move error to new console div!
      console.log(error);
    }
  }
</script>

<div id="sandbox">
  <button on:click={logCode}>log code</button>
  <button on:click={compileCode}>compile code</button>
  <button on:click={run}>run</button>
  <CodeEditor />
</div>
