
<script>
    import { onMount } from 'svelte';
    import { transform } from '@babel/standalone'

    let code;
    onMount(() => {
        const el = document.getElementById("codeeditor").addEventListener("codeedited", (e) => code = e.detail); // TODO: get rid of error here via typescript?: should be customevent not event
    })

    function logCode() {
      console.log(code)
    }

    function compileCode() {
        if (code !== "\n\n\n\n\n\n\n") {
            const scriptElement = document.createElement('script')
            const formattedCode = "function executeClientCode(...args) {" + code + "return sum(...args)}"

            // the code should be transformed to avoid errors with comments, linebreaks etc. 
            const transformedCode = transform(formattedCode, { presets: ["env"] }).code; 
            scriptElement.text = transformedCode
            console.log("compiled function:", scriptElement.text)

            // TODO: parse function with a parser instead of scripting it!
            document.getElementById("codeeditor").appendChild(scriptElement)
            //executeClientCode() //TODO: how to do this better?
        } else {
            alert("please write your code first")
        }
    }

    function run(a, b) {
        console.log(executeClientCode(a, b))
    }
</script>

<div id="codeeditor">
    <script type="module" src="/codemirror.bundle.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <button on:click={logCode}>log code</button>
    <button on:click={compileCode}>compile code</button>

    <button on:click={() => run(1, 2)}>run(1, 2)</button>
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