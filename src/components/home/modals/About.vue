<template>
  <b-modal id="aboutModal"
           title="About"
           ref="aboutModal"
           centered
           ok-only
           hide-header
           hide-footer>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="image-illustration">
      <img src="../../../assets/imgs/icons/wallet/ic_illustration_wallet.svg">
    </div>
    <div class="about-vee wallet">
      <h1> About VEE Wallet</h1>
    </div>
    <div class="version">
      <h3> {{ vnumber }}</h3>
    </div>
    <div class="about_text">
      <p align="left"> Virtual Economy Era(VEE) is a blockchain database cloud that aims to create a brand new digital economy era.
      It is the world's first object-oriented general purpose distributed database.which is empowered to carry nn,mjnm, complex decentralize applicatrions.</p>
    </div>
    <div class="right reserved">
      <p align="left"> @2018 VEE ALL rights reserved</p>
    </div>
  </b-modal>
</template>
<script>
import { WALLET_VERSION } from '@/constants.js'
var initData = {
    vnumber: WALLET_VERSION
}

export default {
    name: 'About',
    created() {
    },
    props: {
        setUsrLocalStorage: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        address: {
            type: String,
            require: true,
            default: ''
        }
    },
    data: function() {
        return initData
    },
    methods: {
        closeModal() {
            this.$refs.aboutModal.hide()
        }
    }
}
</script>

<style scoped>
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.about-vee wallet {
    color:#FFFFFF;
    font-size: 7px;
}
.version {
    color:#696B8A;
    font-size:15px;
}
.about_text {
    color:#696B8A;
    font-size:15px;
}
.right reserved {
    left:0;
    margin-left: 0;
    color:#ced4da;
    font-size:15px;
}
</style>
