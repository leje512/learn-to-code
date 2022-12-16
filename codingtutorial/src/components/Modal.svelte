<script>
  import { createEventDispatcher } from "svelte"
  export let backgroundColor

  const dispatch = createEventDispatcher()

  function closeModal() {
    dispatch("close")
  }
</script>

<transition name="modal">
  <div class="modal-wrapper">
    <div class="modal" style="background-color: {backgroundColor};">
      <span class="close" on:click={closeModal}>x</span>
      <h3 class="title">
        <slot name="title" />
      </h3>
      <slot name="content" />
      <slot class="actions" name="actions" />
    </div>
  </div>
</transition>

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
    width: 60vw;
    max-width: 800px;
    max-height: 80vh;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow-y: scroll;
  }

  .close {
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
