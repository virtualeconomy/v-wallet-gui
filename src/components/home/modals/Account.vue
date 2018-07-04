<template>
  <b-modal id="accountModal"
           title="Account"
           @hidden="resetData"
           size="md"
           ok-only>
    <div class="account-container">
      <b-form-group label="Wallet Address"
                    label-for="walletAddress">
        <b-form-input id="walletAddress"
                      readonly
                      size="sm"
                      v-model="address">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Cold Wallet Address">
        <b-input-group
          class="mb-2"
          v-if="coldWalletNum > 0"
          v-for="(pubkey, addr) in coldAddresses"
          :key="addr">
          <b-dropdown
            :text="tagOfColdWallet[addr] ? 'public key' : 'address'"
            class="dropt"
            variant="secondary"
            size="sm"
            slot="prepend">
            <b-dropdown-item
              class="drop-item"
              @click="showAddr(addr)">address</b-dropdown-item>
            <b-dropdown-item
              class="drop-item"
              @click="showKey(addr)">public key</b-dropdown-item>
          </b-dropdown>
          <b-form-input
            readonly
            size="sm"
            :value="tagOfColdWallet[addr] ? pubkey : addr">
          </b-form-input>
          <b-input-group-append>
            <b-btn
              variant="dark"
              v-b-tooltip.hover
              title="Delete the coldwallet"
              @click="deleteCold(addr)"
              size="sm">×</b-btn>
          </b-input-group-append>
        </b-input-group>
        <b-form-input
          v-if="coldWalletNum == 0"
          readonly
          no-resize
          size="sm"
          value="No cold wallet imported">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Public Key"
                    label-for="pubKey">
        <b-form-input id="pubKey"
                      readonly
                      size="sm"
                      v-model="pubKey">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Private Key"
                    label-for="priKey">

        <b-btn
          v-if="privateKeyHidden"
          variant="warning"
          @click="showPriKey"
          :block="true"
          size="sm">show</b-btn>
        <b-input-group v-else>
          <b-form-input
            id="priKey"
            readonly
            size="sm"
            v-model="privateKey">
          </b-form-input>
          <b-input-group-append>
            <b-btn
              variant="warning"
              @click="hidePriKey"
              size="sm">hide</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group label="Seed"
                    label-for="seed">

        <b-btn
          v-if="seedHidden"
          variant="warning"
          @click="showSeed"
          :block="true"
          size="sm">show</b-btn>
        <b-input-group v-else>
          <b-form-textarea
            id="seed"
            readonly
            size="sm"
            no-resize
            rows="2"
            v-model="seed">
          </b-form-textarea>
          <b-input-group-append>
            <b-btn
              variant="warning"
              @click="hideSeed"
              size="sm">hide</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'Account',
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        coldAddresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        pubKey: {
            type: String,
            require: true,
            default: ''
        },
        getPriKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        getSeedPhrase: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        }
    },
    data() {
        return {
            seed: '',
            privateKey: '',
            seedHidden: true,
            privateKeyHidden: true,
            tagOfColdWallet: {}
        }
    },
    created() {
        this.coldWalletNum = Object.keys(this.coldAddresses).length
    },
    watch: {
        coldAddresses() {
            this.coldWalletNum = Object.keys(this.coldAddresses).length
        }
    },
    methods: {
        showSeed() {
            setTimeout(() => {
                this.seed = this.getSeedPhrase()
                this.seedHidden = false
            }, 800)
        },
        hideSeed() {
            this.seed = ''
            this.seedHidden = true
        },
        showPriKey() {
            setTimeout(() => {
                this.privateKey = this.getPriKey()
                this.privateKeyHidden = false
            }, 800)
        },
        hidePriKey() {
            this.privateKey = ''
            this.privateKeyHidden = true
        },
        resetData() {
            this.seed = ''
            this.privateKey = ''
            this.seedHidden = true
            this.privateKeyHidden = true
            this.tagOfColdWallet = {}
            this.coldWalletNum = Object.keys(this.coldAddresses).length
        },
        showAddr(addr) {
            Vue.set(this.tagOfColdWallet, addr, false)
        },
        showKey(addr) {
            Vue.set(this.tagOfColdWallet, addr, true)
        },
        deleteCold(addr) {
            this.$emit('delete-cold', addr)
        }
    }
}
</script>

<style scoped>
.account-container {
    text-align: left;
}
.tag-coldwallet {
    width: 100px;
}
.drop-item {
    padding: 0px 10px;
    width: 100px;
}
</style>
