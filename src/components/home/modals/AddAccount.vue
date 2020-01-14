<template>
  <b-modal id="addAccountModal"
           ref="addAccountModal"
           centered
           hide-footer
           hide-header
           lazy
           :busy="true"
           title="Add Account"
           @hidden="closeModal">
    <button class="close btn-close"
            @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container class="text-left">
      <p class="monitor">Add Account</p>
      <p class="information">You will add a new account that cannot be deleted. Are you sure to add?</p>
      <b-row>
        <b-col class="col-lef">
          <b-button
            class="btn-cancel"
            block
            variant="light"
            size="lg"
            @click="closeModal">Cancel
          </b-button>
        </b-col>
        <b-col class="col-rit">
          <b-button
            block
            class="btn-add"
            variant="warning"
            size="lg"
            @click="add">Add
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'AddAccount',
    computed: {
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        }
    },
    methods: {
        add() {
            let newItem = JSON.parse(window.localStorage.getItem(this.seedAddress))
            newItem['walletAmount'] = newItem['walletAmount'] + 1
            window.localStorage.setItem(this.seedAddress, JSON.stringify(newItem))
            this.$emit('refreshAccount')
            this.$refs.addAccountModal.hide()
        },
        closeModal() {
            this.$refs.addAccountModal.hide()
        }
    }
}
</script>

<style scoped>
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}
.btn-cancel {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.btn-add {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.monitor {
    font-family: Roboto-Regular;
    font-size: 26px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
}
.information {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
    max-width: 300px;
    margin: 30px auto;
    margin-top: 20px;
}
</style>
