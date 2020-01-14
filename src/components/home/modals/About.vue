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
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="about-container">
      <div class="image-illustration">
        <img src="@/assets/imgs/icons/wallet/ic_illustration_wallet.svg">
      </div>
      <div class="about-vsyswallet">About V Wallet
      </div>
      <div class="version">Version {{ vNumber }}
      </div>
      <div class="about_text">
        V Wallet is a reference implementation of cross-platform browser wallet for the V Systems blockchain network. It features basic hot wallet mode and cold wallet interaction/monitoring mode.<br>It implements V Systems wallet format specification 1.0 and V Systems wallet QR code API 4.0.
      </div>
      <div class="right-reserved">@2018-2020 V SYSTEMS LIMITED All rights reserved
      </div>
    </div>
  </b-modal>
</template>
<script>
import { WALLET_VERSION } from '@/constants'
var initData = {
    vNumber: WALLET_VERSION
}
export default {
    name: 'About',
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
    right: 20px;
}
.about-container {
    text-align: center;
}
.image-illustration{
    margin-top: 30px;
    margin-bottom: 40px;
}
.about-vsyswallet {
    color:#181B3A;
    font-size: 34px;
}
.version {
    color:#9091A3;
    font-size:18px;
}
.about_text {
    margin: 30px 15px 20px 15px;
    color:#4F515E;
    font-size:15px;
    text-align: left;
}
.right-reserved {
    text-align: center;
    color:#9091A3;
    float:left;
    font-size:15px;
    width: 100%;
}
</style>
