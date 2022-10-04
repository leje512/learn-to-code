<script>
  import CodeEditor from './CodeEditor.svelte'
</script>

<main>
  <div id="task">Write a function sum with two parameters that returns the sum of both numbers</div>
  <CodeEditor />
  <div class="actions">
    <button>Run code</button>
    <button>Test code</button>
  </div>
  <div id="tests">3 === sum(1, 2)</div>
</main>

<style>
  main {
    text-align: left;
  }
</style>
