<template>
  <div class="layout-main">
    <div class="container logo">
      <img
        class="brand-logo"
        src="../assets/imgs/logo-small.png">
    </div>
    <div class="home">
      <div>
        <div class="title-des">
          <H1>
            Restore your account
          </H1>
          <div class="footer-link">
            <a href="/login"><small>Login</small></a>
          </div>
          <div class="footer-link">
            <a href="/signup"><small>Signup</small></a>
          </div>
          <hr>
        </div>
      </div>
      <div class="login-forms">
        <p
          v-show="!isSeedNoErr">
          Please enter your wallet seed here.
        </p>
        <p
          class="seed-des"
          v-show="!isSeedNoErr">
          <small class="text-muted">
            Wallet seed is the 15 words you are keeping as backup.
            The words should be seperated by single space
          </small>
        </p>
        <b-form-textarea
          v-model="seedInput"
          maxlength="150"
          @keydown.native.enter='preventDefault($event)'
          :state="isSeedNoErr"
          :disabled="isSeedNoErr"
          placeholder="Enter 15 words here"
          :no-resize="true"
          :rows="4"
          :max-rows="6"
          @input="hideErrMsg">
        </b-form-textarea>
        <div
          class="msg-err text-danger"
          v-show="showSeedErr">
          <small>
            Sorry, the seed is not valid.
          </small>
        </div>
        <b-button
          v-if="seedBtnUp"
          class="btn-continue dropdown shadow-sm"
          :disabled="showSeedErr"
          :variant="'primary'"
          :size="'lg'"
          @click="checkSeed"
          :block=true>
          Continue
        </b-button>
        <b-button
          v-else
          class="btn-continue dropup shadow-sm"
          :variant="'warning'"
          :size="'sm'"
          @click="editSeed"
          :block=true>
          Edit wallet seed
        </b-button>
        <update-account
          class="update-form"
          :seed-phrase="seedPhrase"
          v-if="isSeedNoErr">
        </update-account>
      </div>
    </div>
  </div>
</template>

<script>
import seedDic from '@/libs/seedDictionary.js'
import UpdateAccount from '@/components/restore/UpdateAccount'

export default {
    name: 'Restore',

    data: function() {
        return {
            pageId: 'registration',
            seedInput: '',
            isSeedNoErr: void 0,
            showSeedErr: false,
            seedBtnUp: true,
            seedPhrase: ''
        }
    },

    methods: {

        checkSeed() {
            const isOk = this.isValidSeed(this.seedInput.trim())
            this.showSeedErr = !isOk
            this.isSeedNoErr = isOk
            this.seedBtnUp = !isOk
            if (isOk) {
                this.seedPhrase = this.seedInput.trim()
            }
        },

        isValidSeed(seedPhrase) {
            const wordList = seedPhrase.split(' ')
            if (wordList.length !== 15) {
                return false
            }

            const libSet = new Set(seedDic)
            return wordList.every(i => libSet.has(i))
        },

        preventDefault(event) {
            if (event) {
                event.preventDefault()
            }
        },

        editSeed() {
            this.showSeedErr = false
            this.isSeedNoErr = void 0
            this.seedBtnUp = true
        },

        hideErrMsg() {
            this.showSeedErr = false
            this.isSeedNoErr = void 0
        }
    },

    components: {
        UpdateAccount
    }
}
</script>

<style scoped>
.layout-main {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}
.brand-logo {
    float: left;
    margin-left: 70px;
    margin-top: 12px;
}
.logo {
   width: 100%;
   height: 100px;
}
.title-des {
    width: 450px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.login-forms {
    width: 450px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.footer-link {
    width: 100%;
    display: inline-block;
    text-align: right;
    line-height: 80%
}
.btn-continue {
    margin-top: 30px;
}
.msg-err {
    margin-top: 10px;
    height: 10px;
}
.dropup:after {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: .255em;
    vertical-align: .255em;
    content: "";
    border-top: 0;
    border-right: .3em solid transparent;
    border-bottom: .3em solid;
    border-left: .3em solid transparent;
}
.dropup {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}
.dropdown:after {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: .255em;
    vertical-align: .255em;
    content: "";
    border-top: .3em solid;
    border-right: .3em solid transparent;
    border-bottom: 0;
    border-left: .3em solid transparent;
}
.seed-des {
    text-align: left;
    line-height: 120%;
}
.update-form {
}
</style>
