<script>
  import CodeEditor from './CodeEditor.svelte'
</script>

<main>
  <div id="task">task here</div>
  <CodeEditor />
  <div class="actions">
    <button>Run code</button>
    <button>Test code</button>
  </div>
  <div id="tests">Tests here</div>
</main>

<style>
  main {
    text-align: left;
  }
</style>
