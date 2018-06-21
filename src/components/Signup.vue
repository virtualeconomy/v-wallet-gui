<template>
  <div class="layout-main">
    <v-header></v-header>
    <create-account
      v-if="pageId==='registration'"
      @show-page="changePage"></create-account>
    <save-backup
      v-else-if="pageId==='saveBackup'"
      @show-page="changePage"></save-backup>
    <confirm-backup
      v-else-if="pageId==='confirmBackup'"
      @show-page="changePage"></confirm-backup>
  </div>
</template>
<script>
import CreateAccount from '@/components/signup/pages/CreateAccount'
import SaveBackup from '@/components/signup/pages/SaveBackup'
import ConfirmBackup from '@/components/signup/pages/ConfirmBackup'
import VHeader from '@/components/signup/elements/VHeader'

export default {
    name: 'Signup',
    data: function() {
        return {
            pageId: 'registration'
        }
    },
    components: {
        CreateAccount,
        SaveBackup,
        ConfirmBackup,
        VHeader
    },
    methods: {
        changePage: function(newPageId) {
            this.pageId = newPageId
        }
    }
}
</script>

<style scoped>
.layout-main {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}
</style>
