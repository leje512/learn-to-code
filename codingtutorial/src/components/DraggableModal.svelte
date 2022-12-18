<script>
  import { createEventDispatcher } from "svelte"
  import { transform } from "css-calc-transform"

  let modalWidth = "50vw"
  let modalHeight = "80vh"
  let window = {
    width: document.body.offsetWidth,
    height: document.body.offsetHeight,
  }
  export let backgroundColor = "white"
  export let backgroundUsable = true
  export let left = transform({
    prop: "left",
    value: `calc((100vw - ${modalWidth})/ 2)`,
    win: window,
  })
  export let top = transform({
    prop: "top",
    value: `calc((100vw - ${modalHeight})/ 2)`,
    win: window,
  })

  const dispatch = createEventDispatcher()

  let moving = false
  let minimized = false

  function onMouseDown() {
    moving = true
  }

  function onMouseMove(e) {
    if (moving) {
      left += e.movementX
      top += e.movementY
      dispatch("move", {
        left,
        top,
      })
    }
  }

  function onMouseUp() {
    moving = false
  }

  function minimizeModal() {
    minimized = true
  }

  function maximizeModal() {
    minimized = false
  }

  function closeModal() {
    dispatch("close")
  }
</script>

<transition name="modal">
  <div class={backgroundUsable ? "" : "modal-wrapper"}>
    <div
      on:mousedown={onMouseDown}
      style="--modalWidth:{modalWidth};--modalHeight:{modalHeight};left: {left}px; top: {top}px; background-color: {backgroundColor};"
      class="modal {minimized ? 'minimized' : ''}"
    >
      <div class="taskbar">
        {#if !minimized}
          <span on:click={minimizeModal}>_</span>
        {:else}
          <span on:click={maximizeModal}>o</span>
        {/if}
        <span on:click={closeModal}>x</span>
      </div>
      {#if !minimized}
        <h3 class="title">
          <slot name="title" />
        </h3>
      {/if}
      <slot name="content" />
      {#if !minimized}
        <slot class="actions" name="actions" />
      {/if}
    </div>
  </div>
</transition>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
  .modal-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 21;
    box-sizing: border-box;
    padding: 10vh 32px 32px;
  }

  .modal-wrapper:before {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    flex: 1;
    width: 100%;
    height: 100%;
    content: "";
  }

  .modal {
    position: absolute;
    margin: auto;
    width: var(--modalWidth);
    max-height: var(--modalHeight);
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow-y: auto;
    cursor: move;
  }

  .minimized {
    max-height: 20vh;
  }

  .taskbar {
    margin-left: auto;
    cursor: pointer;
    font-size: 2em;
  }

  h3 {
    margin: 5px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.actions) {
    margin-left: auto;
    padding: 5px;
  }
</style>
