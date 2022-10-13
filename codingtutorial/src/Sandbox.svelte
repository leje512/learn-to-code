
<script>
    import { onMount } from 'svelte';
    import { transform } from '@babel/standalone'
    import CodeEditor from './CodeEditor.svelte';

    let code;
    let result;
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
            document.getElementById("codeeditor").removeChild(scriptElement)
        } else {
            alert("please write your code first")
        }
    }

    function run(a, b) {
        // TODO: try to get rid of all problems caused by adding a function on runtime
        result = executeClientCode(a, b)
        console.log(result)
    }
</script>

<div id="sandbox">
    <button on:click={logCode}>log code</button>
    <button on:click={compileCode}>compile code</button>
    <button on:click={() => run(1, 2)}>run(1, 2)</button>
    Ergebnis: { result }
    <CodeEditor />
</div>