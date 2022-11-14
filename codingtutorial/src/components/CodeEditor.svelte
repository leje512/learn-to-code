<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { lintGutter } from "@codemirror/lint";
  import { EditorState } from "@codemirror/state";
  import customLinter from "../customlinter";
  // import Linter from "eslint4b-prebuilt"; // TODO: cite code?? https://codesandbox.io/s/f6nb0?file=/src/index.js:236-253 @ts-ignore: ts2350

  const dispatch = createEventDispatcher();
  export let initialcode = "";

  let state = EditorState.create({
    doc: initialcode,
    extensions: [
      basicSetup,
      javascript(),
      lintGutter(),
      customLinter,
      EditorView.updateListener.of((update) => {
        dispatch("edited", {
          text: update.state.doc.toString(),
        });
      }),
    ],
  });

  onMount(() => {
    new EditorView({
      state,
      parent: document.getElementById("codeeditor"),
    });
  });
</script>

<div id="codeeditor" />

<style>
  #codeeditor {
    width: 50vw;
  }
  #codeeditor .cm-editor {
    width: 100%;
    height: 30vh;
  }
</style>
