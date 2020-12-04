<template>

</template>

<script>
import Vue from 'vue'
export default {
    name: 'ContractManagement',
    prop: {
    },
    data() {
        return {
            curContractID: '',
            curContractType: '',
            contractList: {}
        }
    },
    created() {
        if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
            this.contractList = JSON.parse(window.localStorage.getItem(this.defaultAddress)).contract
        }
    },
    computed: {
        defaultAddress() {
            return Vue.ls.get('address')
        }
    },
    methods: {
        resetData() {
            this.contractList = JSON.parse(window.localStorage.getItem(this.defaultAddress)).contract
            this.curContractID = ''
            this.curContractType = ''
        },
        addContract() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo.contract, this.curContractID, this.curContractType)
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
            this.resetData()
        }
    }
}
</script>

<style scoped>

</style>
