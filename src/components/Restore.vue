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
        <b-form-textarea
          v-model="seedInput"
          maxlength="150"
          @keydown.native.enter='preventDefault($event)'
          :state="isSeedNoErr"
          :disabled="isSeedNoErr"
          placeholder="Please enter your wallet seed here, the 15 words you are keeping as backup, seperating by single space"
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
          :disabled="showSeedErr"
          :variant="'primary'"
          :size="'lg'"
          @click="checkSeed"
          :block=true>
          Continue
        </b-button>
        <b-button
          v-else
          class="btn-continue dropup"
          :variant="'warning'"
          :size="'sm'"
          @click="editSeed"
          :block=true>
          Edit wallet seed
        </b-button>
        <div
          v-show="isSeedNoErr">
          <p>hahahahhahhahahahahahahahahah</p>
        </div>
        <!-- <form class="text-left container">
          <div>
            <label>Avatar</label>
            <div class="avatar-group">
              <canvas
                class="avatar"
                width="120"
                height="120"
                :data-jdenticon-hash="avatarDataHex">
                Fallback text for browsers not supporting canvas
              </canvas>
              <button
                class="btn-change-avt"
                type="button"
                :disabled="!avatarCanChange||registering"
                @click="changeAvatar()">
                change one {{ timeLeftToChangeStr }}
              </button>
            </div>
          </div>
          <ul class="form-group error-messages">
            <li
              v-for="error in validator.errors"
              :key="error.name">
              <small
                class="form-text text-danger">
                {{ error.msgs[0] }}
              </small>
            </li>
          </ul>
          <div class="form-group username-form">
            <label>Username</label>
            <input
              type="text"
              class="form-control form-control-lg shadow-sm"
              :class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
              v-model="username"
              :readonly="registering"
              @blur="checkUsername(username)">
          </div>
          <div class="form-group password-form">
            <label>Password</label>
            <input
              type="password"
              name="password"
              class="form-control form-control-lg shadow-sm"
              :class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
              v-model="password"
              :readonly="registering"
              @input="checkPassword(password)">
            <small
              id="emailHelp"
              class="form-text text-muted text-right">
              At least 8 characters
            </small>
          </div>
          <div class="form-group">
            <label>Confirm your password</label>
            <input
              type="password"
              class="form-control form-control-lg shadow-sm"
              :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassMatchErrors}"
              v-model="password2"
              :readonly="registering"
              @input="checkPasswordMatch(password, password2)"
              @keyup.enter="registerEnter">
          </div>
          <div class="form-group submit-button">
            <b-button
              :disabled="isSubmitDisabled"
              :variant="'primary'"
              :size="'lg'"
              :block=true
              @click="register">
              Register
            </b-button>
          </div>
        </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import seedDic from '@/libs/seedDictionary.js'

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

        changePage: function(newPageId) {
            this.pageId = newPageId
            console.log(this.pageId)
        },

        checkSeed() {
            console.log(this.seedInput)
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
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.login-forms {
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.footer-link {
    width: 100%;
    display: inline-block;
    text-align: right;
}
.btn-continue {
    margin-top: 20px;
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
</style>
