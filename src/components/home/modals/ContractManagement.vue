<template>

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
export default {
    name: 'ContractManagement',
    prop: {
    },
    data() {
        return {
            curContractID: '',
            curContractType: '',
            contractList: {},
            curContractIsValid: false
        }
    },
    created() {
        if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
            this.contractList = JSON.parse(window.localStorage.getItem(this.defaultAddress)).contract
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        isExistedContract() {
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                let contracts = JSON.parse(window.localStorage.getItem(this.defaultAddress)).contract
                if (contracts) {
                    for (let key in contracts) {
                        if (this.curContractID === key) {
                            return true
                        }
                    }
                }
            }
            return false
        },
        isValidContract() {
            if (!this.curContractID) {
                return void 0
            }
            let isValid = false
            try {
                this.getContractInfo()
                isValid = this.curContractIsValid
            } catch (e) {
                console.log(e)
            }
            return isValid
        }
    },
    methods: {
        resetData() {
            this.contractList = JSON.parse(window.localStorage.getItem(this.defaultAddress)).contract
            this.curContractID = ''
            this.curContractType = ''
            this.curContractIsValid = false
        },
        addContract() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo.contract, this.curContractID, this.curContractType)
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
            this.resetData()
        },
        deleteContract(contractID) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            delete userInfo.contract[contractID]
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
            this.contractList = userInfo.contract
        },
        closeModal() {
            this.resetData()
            this.$refs.contractManagementModal.hide()
        },
        copyText(buttonId, addrToCopy, index) {
            this.$refs[addrToCopy][index].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
        },
        getContractInfo() {
            this.chain.getContractInfo(this.curContractID).then(response => {
                if (response.error) {
                    this.curContractIsValid = false
                } else {
                    this.curContractIsValid = true
                    if (response.type === 'NonFungibleContract') {
                        this.curContractType = 'NFT'
                    } else if (response.type === 'LockContract') {
                        this.curContractType = 'Lock'
                    } else if (response.type === 'PaymentChannelContract') {
                        this.curContractType = 'Payment'
                    }
                }
            }, respError => {
            })
        }
    }
}
</script>

<style scoped>

</style>
