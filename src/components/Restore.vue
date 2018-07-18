<template>
  <div class="layout-main">
    <div class="center">
      <div class="container logo">
        <img
          class="brand-logo"
          src="../assets/imgs/icons/signup/vee_logo.svg">
      </div>
      <div class="home">
        <div>
          <div class="title-des">
            <H1>
              Restore your account
            </H1>
            <hr>
          </div>
        </div>
        <div class="login-forms">
          <p
            class="subtit"
            v-show="!isSeedNoErr">
            Please enter your wallet seed here.
          </p>
          <p
            class="seed-des"
            v-show="!isSeedNoErr">
            <small class="text-muted">
              Wallet seed is the words which you are keeping as backup,
              the words should be seperated by single space
            </small>
          </p>
          <b-form-textarea
            class="non-square"
            v-model="seedInput"
            maxlength="150"
            @keydown.native.enter='preventDefault($event)'
            :state="isSeedNoErr"
            :disabled="isSeedNoErr"
            placeholder="Enter seed phrase here"
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
            class="btn-continue dropdown"
            :disabled="showSeedErr || !seedInput"
            :variant="'warning'"
            :size="'lg'"
            @click="checkSeed"
            :block=true>
            Continue
          </b-button>
          <b-button
            v-else
            class="dropup"
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
        <p class="flink">
          <a
            class='vee-color'
            href="/login">Sign in</a> or <a
              class='vee-color'
              href="/signup">Create a new account</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
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
            this.showSeedErr = false
            this.isSeedNoErr = true
            this.seedBtnUp = false
            this.seedPhrase = this.seedInput.trim()
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
    width: 100%;
    height: 100%;
    min-width: 200px;
    background-color: rgb(249, 249, 249);
}
.brand-logo {
    margin-left: auto;
    margin-right: auto;
}
.logo {
    width: 100%;
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
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    background: #FFB637;
    border-color: #FFB637;
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
.home {
    margin-top: 40px;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 50px;
    border:1px solid #EDEEF2;
    border-radius: 4px;
    background-color: white;
}
.center {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
}
.subtit {
    margin-bottom: 5px;
    text-align: left;
}
.flink {
    margin-top: 20px;
    margin-bottom: 0px;
}
.form-control:disabled, .non-square{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}
</style>
