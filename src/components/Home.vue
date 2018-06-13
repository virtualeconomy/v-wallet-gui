<template>
  <div class="home">
    <v-button btn-text="Primary"
              btn-type="primary"></v-button>
    <v-modal v-show="show"
             transition="modal">

    </v-modal>
  </div>
</template>

<script>
// @ is an alias to /src

import VButton from './ui/button'
import VModal from './ui/modal'

export default {
    name: 'Home',
    components: {
        VModal,
        VButton
    }
}
</script>
