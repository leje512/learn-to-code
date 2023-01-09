<script>
  import DraggableModal from "./DraggableModal.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let tutorContent

  let modalRight
  let modalTop
  let messageIndex = 0

  $: {
    tutorContent
    messageIndex = 0
  }

  function showWhere() {
    dispatch("showWhere")
  }

  function moreInformation() {
    if (messageIndex < tutorContent.messages.length - 1) {
      messageIndex++
    }
  }

  function getBackgroundColor(tutorContent) {
    if (!tutorContent) {
      return "#b7d63a"
    }
    switch (tutorContent.severity) {
      case "error":
        return "#f23d3d"
      case "hint":
        return "#2678bf"
      case "praise":
        return "#b7d63a"
      default:
        return "white"
    }
  }

  function updateModalPosition(event) {
    modalRight = event.detail.right
    modalTop = event.detail.top
  }
</script>

<DraggableModal
  backgroundColor={getBackgroundColor(tutorContent)}
  right={modalRight}
  top={modalTop}
  minimizedAtStart={true}
  on:close={() => dispatch("close")}
  on:move={updateModalPosition}
>
  <span slot="title"
    >{#if tutorContent}Achtung!{:else}Weiter so!{/if}</span
  >
  <p slot="content" id={!tutorContent ? "no-space-wrap" : ""}>
    {#if tutorContent}{tutorContent.messages[messageIndex]}
    {:else}Probiere deinen Code auch zwischendurch mit Run aus. Wenn du denkst,
      dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code
      überprüfen.
    {/if}
  </p>
  <div class="actions" slot="actions">
    {#if tutorContent}
      <button on:click={showWhere}>Wo?</button>
    {/if}
    {#if tutorContent && messageIndex < tutorContent.messages.length - 1}
      <button on:click={moreInformation}>Nächster Tipp</button>
    {/if}
  </div>
</DraggableModal>

<style>
  p {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  #no-space-wrap {
    white-space: inherit;
  }
</style>
