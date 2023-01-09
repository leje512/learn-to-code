<script>
  import DraggableModal from "./DraggableModal.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let showTutorialMessage = true
  export let lintError

  let modalRight
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
    if (messageIndex < lintError.messages.length - 1 || showTutorialMessage) {
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
    modalRight = event.detail.right
    modalTop = event.detail.top
  }
</script>

<DraggableModal
  backgroundColor={showTutorialMessage
    ? getBackgroundColor()
    : getBackgroundColor(lintError)}
  right={modalRight}
  top={modalTop}
  minimizedAtStart={!showTutorialMessage}
  on:close={() => dispatch("close")}
  on:move={updateModalPosition}
>
  <span slot="title"
    >{#if showTutorialMessage}Hallo!{:else if lintError}Achtung!{:else}Weiter
      so!{/if}</span
  >
  <p
    slot="content"
    id={showTutorialMessage || !lintError ? "no-space-wrap" : ""}
  >
    {#if showTutorialMessage && messageIndex === 0}
      Ich bin dein Tutor. Durch Tipps will ich dir helfen, das Programmieren
      besser zu verstehen. Drücke auf Wo, um den Codeausschnitt zu markieren,
      für den der Tipp gedacht ist. Oder drücke auf Nächster Tipp, um dir
      genauere Infos und Anleitungen zur Umsetzung zu holen. Probiers gleich
      aus!
    {:else if showTutorialMessage}
      Super! Hier siehst du normalerweise genauere Tipps oder sogar
      Syntaxvorgaben.
      <p id="no-space-wrap">
        Nutze den Button Run, um deinen Code zwischendurch auszuprobieren. Wenn
        du denkst, dass du die Aufgabe gelöst hast, kannst du deinen Code mit
        Klick auf Test überprüfen lassen. Los geht's!
      </p>
    {:else if lintError}{lintError.messages[messageIndex]}
    {:else}Probiere deinen Code auch zwischendurch mit Run aus. Wenn du denkst,
      dass du die Aufgabe erfüllt hast, klicke Test und lasse deinen Code
      überprüfen.
    {/if}
  </p>
  <div class="actions" slot="actions">
    {#if lintError}
      <button on:click={showWhere}>Wo?</button>
    {/if}
    {#if (showTutorialMessage && messageIndex === 0) || (lintError && messageIndex < lintError.messages.length - 1)}
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
