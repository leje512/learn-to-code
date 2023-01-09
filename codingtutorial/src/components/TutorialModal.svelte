<script>
  import DraggableModal from "./DraggableModal.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let modalRight
  let modalTop
  let messageIndex = 0

  function showWhere() {
    dispatch("showWhere")
  }

  function moreInformation() {
    if (messageIndex < 1) {
      messageIndex++
    }
  }

  function updateModalPosition(event) {
    modalRight = event.detail.right
    modalTop = event.detail.top
  }
</script>

<DraggableModal
  backgroundColor={"#b7d63a"}
  right={modalRight}
  top={modalTop}
  minimizedAtStart={false}
  on:close={() => dispatch("close")}
  on:move={updateModalPosition}
>
  <span slot="title">Hallo!</span>
  <p slot="content" id={"no-space-wrap"}>
    {#if messageIndex === 0}
      Ich bin dein Tutor. Durch Tipps will ich dir helfen, das Programmieren
      besser zu verstehen. Drücke auf Wo, um den Codeausschnitt zu markieren,
      für den der Tipp gedacht ist. Oder drücke auf Nächster Tipp, um dir
      genauere Infos und Anleitungen zur Umsetzung zu holen. Probiers gleich
      aus!
    {:else}
      Super! Hier siehst du normalerweise genauere Tipps oder sogar
      Syntaxvorgaben.
      <p id="no-space-wrap">
        Nutze den Button Run, um deinen Code zwischendurch auszuprobieren. Wenn
        du denkst, dass du die Aufgabe gelöst hast, kannst du deinen Code mit
        Klick auf Test überprüfen lassen. Los geht's!
      </p>
    {/if}
  </p>
  <div class="actions" slot="actions">
    <button on:click={showWhere}>Wo?</button>
    {#if messageIndex === 0}
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
