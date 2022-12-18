<script>
  import DraggableModal from "./DraggableModal.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let showTutorialMessage = true
  export let lintError

  let modalLeft
  let modalTop
  let messageIndex = 0

  $: {
    lintError
    messageIndex = 0
  }

  function showWhere() {
    dispatch("showWhere")
  }

  function moreInformation() {
    if (messageIndex < lintError.messages.length - 1) {
      messageIndex++
    }
  }

  function getBackgroundColor(lintError) {
    if (!lintError) {
      return "#b7d63a"
    }
    switch (lintError.severity) {
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
    modalLeft = event.detail.left
    modalTop = event.detail.top
  }
</script>

<DraggableModal
  backgroundColor={showTutorialMessage
    ? getBackgroundColor()
    : getBackgroundColor(lintError)}
  left={modalLeft}
  top={modalTop}
  on:close={() => dispatch("close")}
  on:move={updateModalPosition}
>
  <span slot="title"
    >{#if showTutorialMessage}Hallo!{:else if lintError && lintError.severity !== "praise"}Achtung!{:else}Weiter
      so!{/if}</span
  >
  <p slot="content" id={showTutorialMessage ? "no-space-wrap" : ""}>
    {#if showTutorialMessage}
      Ich bin dein Tutor. Durch Tipps will ich dir helfen, das Programmieren
      besser zu verstehen. Drücke auf Wo, um den Codeausschnitt zu markieren,
      für den der Tipp gedacht ist. Oder drücke auf Weitere Informationen, um
      dir genauere Infos und Anleitungen zur Umsetzung zu holen. Los geht's!
    {:else if lintError}{lintError.messages[messageIndex]}
    {/if}
  </p>
  <div class="actions" slot="actions">
    {#if lintError && lintError.severity !== "praise"}
      <button disabled={showTutorialMessage} on:click={showWhere}>Wo?</button>
    {/if}
    {#if lintError && messageIndex < lintError.messages.length - 1}
      <button disabled={showTutorialMessage} on:click={moreInformation}
        >Weitere Informationen</button
      >
    {/if}
  </div>
</DraggableModal>
