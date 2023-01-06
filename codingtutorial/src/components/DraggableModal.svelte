<script>
  import { createEventDispatcher } from "svelte"
  import { transform } from "css-calc-transform"

  export let modalWidth = "50vw"
  export let modalHeight = "50vh"
  let win = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  export let backgroundColor = "white"
  export let backgroundUsable = true
  let useBackground = backgroundUsable
  export let minimizable = true
  export let minimizedAtStart = false

  export let left = minimizedAtStart
    ? 20
    : transform({
        prop: "left",
        value: `calc((100vw - ${modalWidth})/ 2)`,
        win,
      })
  export let top = minimizedAtStart
    ? transform({
        prop: "top",
        value: `calc(100vh - 25vh - 20px)`,
        win,
      })
    : transform({
        prop: "top",
        value: `calc((100vh - ${modalHeight})/ 2)`,
        win,
      })

  const dispatch = createEventDispatcher()

  let moving = false
  let minimized = minimizedAtStart

  function onMouseDown() {
    if (backgroundUsable) {
      useBackground = false
    }
    moving = true
  }

  function onMouseMove(e) {
    if (moving && !minimized) {
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
    if (backgroundUsable) {
      useBackground = true
    }
  }

  function minimizeModal() {
    if (minimizable) {
      minimized = true
      left = 20
      top = transform({
        prop: "top",
        value: `calc(100vh - 25vh - 20px)`,
        win,
      })
    }
  }

  function maximizeModal() {
    minimized = false
    left = transform({
      prop: "left",
      value: `calc((100vw - ${modalWidth})/ 2)`,
      win,
    })
    top = transform({
      prop: "top",
      value: `calc((100vh - ${modalHeight})/ 2)`,
      win,
    })
  }

  function closeModal() {
    dispatch("close")
  }
</script>

<div class={useBackground ? "" : "modal-wrapper"}>
  <div
    on:mousedown={onMouseDown}
    style="--modalWidth:{modalWidth};--modalHeight:{modalHeight};left: {left}px; top: {top}px; background-color: {backgroundColor};"
    class="modal {minimized ? 'minimized' : ''}"
  >
    <div class="taskbar">
      {#if minimizable && !minimized}
        <span on:click={minimizeModal}>_</span>
      {:else if minimizable}
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
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
  .modal-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
    position: fixed;
    cursor: initial;
    max-height: 20vh;
    min-height: 20vh;
    max-width: 35vw;
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
