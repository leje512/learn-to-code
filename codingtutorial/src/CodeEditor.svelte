<script>
    import { onMount } from 'svelte';
    let code = "";
    function getCode() {
      console.log(code)
    }
    onMount(() => {
        const el = document.getElementById("codeeditor").addEventListener("codeedited", (e) => code = e.detail); // TODO: get rid of error here via typescript?: should be customevent not event
    })
</script>

<div id="codeeditor">
    <script src="codemirror.bundle.js"></script>
    <button on:click={getCode}>log code</button>
</div>

<style>
#codeeditor {
    width: 50vw;
    min-height: 30vh;
}
</style>