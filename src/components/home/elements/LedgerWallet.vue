<template>
  <div id="ledgerWalletModal"
       ref="ledgerWalletModal"
       class="ledgerWallet">
    <div class="black-title">
      Minitor Ledger Hardware Device
    </div>
    <div class="small-title">Please connect Ledger hardware device with USB as shown in the picture blow and enter VSYS app
    </div>
    <div class="image">
      <img class="image-input"
           src="@/assets/imgs/icons/wallet/img_ledger_device.png">
    </div>
    <div class="account-form">
      <p class="account-input">Choose your account index and then click "Select"</p>
      <div class="select-pane">
        <b-btn variant="warning"
               class="bar-minus"
               @click="minus"><p class="minus">-</p></b-btn>
        <p class="amount-index">{{ addressIndex }}</p>
        <b-btn variant="warning"
               class="bar-plus"
               @click="plus"><p class="plus">+</p></b-btn>
        <b-btn class="btn-select"
               @click="selectAddress">
          <b>Select</b>
        </b-btn>
      </div>
    </div>
    <b-form-group label="Cold Wallet Address"
                  label-for="coldAddress-input">
      <b-form-input id="recipient-input"
                    class="recipient-input"
                    type="text"
                    :state="isValidColdAddress(coldAddress)"
                    v-model="coldAddress"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Retrieve cold wallet address from device">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback">
        Invalid ColdAddress
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Cold Wallet Public Key"
                  label-for="pubKey-input">
      <b-form-input id="pubKey-input"
                    class="recipient-input"
                    type="text"
                    :state="isValidColdPubkey(coldPubkey)"
                    v-model="coldPubkey"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Retrieve public key of cold wallet from device">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback">
        Invalid Pubkey
      </b-form-invalid-feedback>
    </b-form-group>
    <b-row class="row">
      <b-col class="col-lef">
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          :disabled="isSubmitDisabled()"
          @click="sendData">Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
import base58 from '@/libs/base58'
export default {
    name: 'LedgerWallet',
    data: function() {
        return {
            coldAddress: '',
            coldPubkey: '',
            addressIndex: 0
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    methods: {
        closeModal() {
            this.$refs.ledgerWalletModal.hide()
        },
        isValidColdAddress: function(addr) {
            if (!addr) {
                return void 0
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(addr)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidColdPubkey: function(pubkey) {
            if (!pubkey) {
                return void 0
            }
            var pubkeyArr = base58.decode(pubkey)
            return pubkeyArr && pubkeyArr.length === 32
        },
        minus() {
            if (this.addressIndex > 0) {
                this.addressIndex--
            }
        },
        plus() {
            if (this.addressIndex < 10) {
                this.addressIndex++
            }
        },
        isSubmitDisabled() {
            return !(this.isValidColdAddress(this.coldAddress) && this.isValidColdPubkey(this.coldPubkey))
        },
        selectAddress() {
            return void 0
        },
        sendData() {
            return void 0
        }
    }
}
</script>

<style scoped>
.black-title {
    font-family: Roboto-Regular;
    font-size: 26px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
    margin-top: 15px;
}
.small-title {
    font-family: Roboto-Regular;
    width: 360px;
    margin-left: 40px;
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
}
.image-input {
    background: #FAFAFA;
    margin-left: 70px;
}
.image {
    background: #FAFAFA;
    margin-top: 20px;
}
.select-input {
    font-family: Roboto-Regular;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
.account-form {
    margin-top: 15px;
    margin-bottom: 15px;
}
.select-pane {
    background: #FAFAFA;
    border-radius: 4px;
    height: 54px;
}
.bar-minus {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    position: absolute;
    margin-left: 10px;
    margin-top: 15px;
}
.minus {
    position: absolute;
    margin: -11px -2px;
}
.bar-plus {
    width: 24px;
    height: 24px;
    margin-top: 15px;
    margin-left: 80px;
    margin-bottom: 15px;
    border-radius: 50%;
}
.plus {
    position: absolute;
    margin: -11px -4px;
}
.amount-index {
    font-size: 15px;
    position: absolute;
    margin-left: 55px;
    margin-top:  15px;

}
.btn-select {
    border-color: #FF8837;
    color: #FF8837;
    background: #FAFAFA;
    border-radius: 4px;
    font-size: 17px;
    font-weight:lighter;
    background:#fafafa;
    margin-left: 230px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.row {
    margin-top: 25px;
    margin-bottom: 15px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
</style>
