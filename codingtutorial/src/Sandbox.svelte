<script>
  import { onMount } from 'svelte'
  import { transform } from '@babel/standalone'
  import CodeEditor from './CodeEditor.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let code
  const initialcode =
    'function sum(a, b) {\n//write your code here\n}\n\n\n\n\n'
  let consoleCode = ''

  onMount(() => {
    // eventListener to get editor content
    const el = document
      .getElementById('codeeditor')
      .addEventListener('codeedited', (e) => (code = e.detail)) // TODO: get rid of error here via typescript?: should be customevent not event

    // override console.log to show message in div
    const consoleLog = console.log
    console.log = function (msg) {
      consoleLog.apply(console, arguments)
      consoleCode = `${consoleCode}${msg}\n`
    }
  })

  function logCode() {
    console.log(code)
  }

  function run() {
    const transformedCode = transform(code, { presets: ['env'] }).code
    dispatch('code', {
      text: transformedCode,
    })
    consoleCode = ''
    try {
      Function(transformedCode)()
    } catch (error) {
      console.log(error) // as long as console.log is extended, consoleCode = `${consoleCode}${msg}\n` is not necessary here
    }
  }
</script>

<div id="sandbox">
  <button on:click={logCode}>log code</button>
  <button on:click={run}>run code</button>
  <CodeEditor {initialcode} />
  <p id="console">
    {consoleCode}
  </p>
</div>

<style>
  p {
    white-space: pre-line;
  }
</style>
