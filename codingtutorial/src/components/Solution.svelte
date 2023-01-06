<script>
  import { createEventDispatcher } from "svelte"
  import DraggableModal from "./DraggableModal.svelte"
  import CodeEditor from "./CodeEditor.svelte"

  const dispatch = createEventDispatcher()

  export let solution
</script>

<div class="modal">
  <DraggableModal
    backgroundColor="#faea49"
    modalWidth="70vw"
    backgroundUsable={false}
    minimizable={false}
    on:close={() => dispatch("close")}
  >
    <span slot="title">Lösung</span>
    <div slot="content">
      <p>
        Das ist EINE Lösung für diese Aufgabe. Es können aber auch andere
        Ansätze zum gleichen Ziel führen.
      </p>
      <CodeEditor initialcode={solution} />
    </div>
  </DraggableModal>
</div>
