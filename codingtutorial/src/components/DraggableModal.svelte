<script>
  import { createEventDispatcher } from "svelte"
  import { transform } from "css-calc-transform"

  const dispatch = createEventDispatcher()

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
  let minimized = minimizedAtStart

  let moving = false

  export let right = minimizedAtStart
    ? 20
    : transform({
        prop: "right",
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

  function onMouseDown() {
    if (backgroundUsable) {
      useBackground = false
    }
    moving = true
  }

  function onMouseMove(e) {
    if (moving && !minimized) {
      right -= e.movementX
      top += e.movementY
      dispatch("move", {
        right,
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
      right = 20
      top = transform({
        prop: "top",
        value: `calc(100vh - 25vh - 20px)`,
        win,
      })
    }
  }

  function maximizeModal() {
    minimized = false
    right = transform({
      prop: "right",
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
    style="--modalWidth:{modalWidth};--modalHeight:{modalHeight};right: {right}px; top: {top}px; background-color: {backgroundColor};"
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
    border-radius: 8px;
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
</style>
