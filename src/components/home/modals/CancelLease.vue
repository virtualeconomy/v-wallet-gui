<template>
  <b-modal :id="'cancelLeaseModal_' + modalId"
           centered
           lazy
           title="cancel lease"
           hide-footer
           hide-header
           ref="cancelLeaseModal"
           :busy="true"
           @hidden="resetPage"
           class="cl-modal">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <Confirm :address="address"
             :amount="amount"
             :fee="fee"
             :tx-type="'cancelLease'">
    </Confirm>
    <b-row>
      <b-col class="col-lef">
        <b-button
          class="btn-back"
          block
          variant="light"
          size="lg"
          @click="prevPage">Back
        </b-button>
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          @click="sendData('hotWallet')">Confirm
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Confirm from './Confirm'
export default {
    name: 'CancelLease',
    components: { Confirm },
    props: {
        walletType: {
            type: String,
            default: '',
            require: true
        },
        address: {
            type: String,
            default: '',
            require: true
        },
        amount: {
            type: Number,
            default: 0,
            require: true
        },
        fee: {
            type: Number,
            default: 0,
            require: true
        },
        recipient: {
            type: String,
            default: '',
            requrie: true
        },
        modalId: {
            type: String,
            default: '',
            require: true
        }
    },
    methods: {
        resetPage() {
        },
        closeModal() {
            this.$refs.cancelLeaseModal.hide()
        }
    }
}
</script>

<style scoped>
.cl-modal {
    text-align: center;
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.btn-back {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
</style>
