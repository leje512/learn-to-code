<script>
  import { onMount } from 'svelte'
  import { EditorView, basicSetup } from 'codemirror'
  import { javascript, esLint } from '@codemirror/lang-javascript'
  import { linter, lintGutter } from '@codemirror/lint'
  import Linter from 'eslint4b-prebuilt' // TODO: cite code?? https://codesandbox.io/s/f6nb0?file=/src/index.js:236-253

  export let initialcode = ''

  onMount(() => {
    new EditorView({
      doc: initialcode, //TODO: multiple lines at creation
      extensions: [
        basicSetup,
        javascript(),
        lintGutter(),
        // @ts-ignore: ts2350
        linter(esLint(new Linter())),
        EditorView.updateListener.of((update) => {
          const codeedited = new CustomEvent('codeedited', {
            detail: update.state.doc.toString(),
          })
          document.getElementById('codeeditor').dispatchEvent(codeedited)
        }),
      ],
      parent: document.getElementById('codeeditor'),
    })
  })
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
