<template>
  <b-modal id="accountModal"
           title="Account">
    <div>
      <b-form-group label="Wallet Address"
                    label-for="walletAddress">
        <b-form-input id="walletAddress"
                      readonly
                      size="sm"
                      v-model="address">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Cold Wallet Address"
                    label-for="coldAddress">
        <b-form-input id="coldAddress"
                      readonly
                      size="sm"
                      v-model="coldAddress">
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
        <!--<b-button @click="privateKey">show</b-button>-->
        <b-form-input id="priKey"
                      readonly
                      size="sm"
                      v-model="privateKey">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Seed"
                    label-for="seed">
        <!--<b-button @click="seedPhrase">show</b-button>-->
        <b-form-input id="seed"
                      readonly
                      size="sm"
                      v-model="seed">
        </b-form-input>
      </b-form-group>
    </div>
  </b-modal>
</template>

<script>
export default {
    name: 'Account',
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        coldAddress: {
            type: String,
            require: true,
            default: ''
        },
        pubKey: {
            type: String,
            require: true,
            default: ''
        },
        priKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        seedPhrase: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        }
    },
    data() {
        return {
            seed: this.seedPhrase(),
            privateKey: this.priKey()
        }
    }
}
</script>

<style scoped>

</style>
