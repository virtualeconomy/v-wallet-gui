<template>
  <b-modal :id="'txInfoModal_' + modalId"></b-modal>
</template>

<script>
export default {
    name: 'TxInfoModal',
    props: {
        modalId: {
            type: String,
            default: ''
        }
    },
    created: function() {
        console.log(this.modalId)
    }
}
</script>

<style scoped>

</style>
