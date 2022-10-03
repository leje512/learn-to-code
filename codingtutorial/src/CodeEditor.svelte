
<script>
    import { onMount } from 'svelte';
    import { transform } from '@babel/standalone'

    let code = "";
    onMount(() => {
        const el = document.getElementById("codeeditor").addEventListener("codeedited", (e) => code = e.detail); // TODO: get rid of error here via typescript?: should be customevent not event
    })

    function logCode() {
      console.log(code)
    }

    function runCode() {
        const transformedCode = transform(code, { presets: ["env"] }).code;
        const scriptElement = document.createElement('script')
        scriptElement.text = transformedCode
        document.getElementById("codeeditor").appendChild(scriptElement)
    }
</script>

<div id="codeeditor">
    <script type="module" src="/codemirror.bundle.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <button on:click={logCode}>log code</button>
    <button on:click={runCode}>run code</button>
</div>

<style>
#codeeditor {
    width: 50vw;
}
#codeeditor .cm-editor{
    width: 100%;
    height: 30vh;
}
</style>