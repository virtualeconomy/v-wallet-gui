<template>
  <div class="login-forms">
    <form class="text-left">
      <div>
        <label>Your avatar</label>
        <div class="avatar-group">
          <canvas class="avatar"
                  width="85"
                  height="85"
                  :data-jdenticon-hash="avatarDataHex">Fallback text for browsers not supporting canvas
          </canvas>
        </div>
      </div>
      <div class="form-group amount-form">
        <label>Number of addresses</label>
        <p class="amount-tip">You can create 1-10 addresses at a time</p>
        <div>
          <b-btn variant="warning"
                 class="bar-minus"
                 @click="minus">-</b-btn>
          <b-progress :value="addressAmount"
                      :max="max"
                      variant="warning"
                      class="pg-bar"
                      show-value></b-progress>
          <b-btn variant="warning"
                 class="bar-plus"
                 @click="plus">+</b-btn>
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
        <label>Update your username</label>
        <input
          type="text"
          class="form-control input-height"
          :class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
          v-model="username"
          placeholder="Set new name"
          :readonly="registering"
          @input="checkUsername(username)">
      </div>
      <div class="form-group password-form">
        <label>Set a new password</label>
        <input
          type="password"
          name="password"
          class="form-control input-height"
          :class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
          v-model="password"
          placeholder="Set new password"
          :readonly="registering"
          @input="checkPassword(password)">
        <small
          id="emailHelp"
          class="form-text text-muted text-right">
          At least 8 characters
        </small>
      </div>
      <div class="form-group">
        <label>Confirm password</label>
        <input
          type="password"
          class="form-control input-height"
          :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassMatchErrors}"
          v-model="password2"
          :readonly="registering"
          placeholder="Confirm password"
          @input="checkPasswordMatch(password, password2)"
          @keyup.enter="registerEnter">
      </div>
      <div class="form-group submit-button">
        <b-button
          class="input-height"
          :disabled="isSubmitDisabled"
          :variant="'warning'"
          :block=true
          @click="register">
          Update your account
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import VTitle from '@/components/signup/elements/VTitle'

import seedLib from '@/libs/seed.js'
import converters from '@/libs/converters.js'
import validator from 'vue-m-validator'
import Vue from 'vue'
import { INITIAL_SESSION_TIMEOUT } from '@/constants.js'
import jdenticon from '@/libs/jdenticon-2.1.0'

export default {
    name: 'CreateAccount',

    props: {
        seedPhrase: {
            type: String,
            default: ''
        }
    },

    data: function() {
        return {
            isFirstRun: true,
            isFirst: {
                'username': true,
                'pwd1': true,
                'pwd2': true
            },
            username: '',
            password: '',
            password2: '',
            validator: validator,
            registering: false,
            addressAmount: 1,
            max: 10
        }
    },

    created() {
        validator.reset()
        this.seed = seedLib.fromExistingPhrase(this.seedPhrase)
        try {
            const usr = JSON.parse(
                window.localStorage.getItem(this.seed.address)).username
            if (usr) {
                this.username = usr
                this.isFirst.username = false
            }
        } catch (err) {
            this.username = ''
        }
    },

    mounted() {
        jdenticon()
    },

    methods: {
        notFirst(field) {
            this.isFirst[field] = false
            this.isFirstRun = /true/i.test(Object.values(this.isFirst).join(''))
        },
        checkUsername(_username) {
            const USERNAME = _username.trim()
            const RULE_1 = {
                expression: !USERNAME || USERNAME === '',
                name: 'username',
                msg: 'Username is required'
            }
            const RULE_2 = {
                expression: /[-+\\.,/()*&^%$#@!~?{};:<>|]/.test(USERNAME),
                name: 'username',
                msg: 'Username is not valid (special symbols detected)'
            }
            const RULE_3 = {
                expression: USERNAME.length > 128,
                name: 'username',
                msg: 'Username is too long (should be at most 128 characters)'
            }
            const RULE_4 = {
                expression: USERNAME.length < 3 && USERNAME.length !== 0,
                name: 'username',
                msg: 'Username is too short (should be at least 3 characters)'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
                .addRule(RULE_3)
                .addRule(RULE_4)
            this.notFirst('username')
        },
        checkPassword(pass) {
            const RULE_1 = {
                expression: !pass || pass === '',
                name: 'pass',
                msg: 'Password is required'
            }
            const RULE_2 = {
                expression: pass.length < 8,
                name: 'pass',
                msg: 'Your password should be of at least 8 characters'
            }
            const RULE_3 = {
                expression: !(/[a-zA-z]/.test(pass)),
                name: 'pass',
                msg: 'Your passowrd must contain alphabetical character'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
                .addRule(RULE_3)
            if (!this.isFirst['pwd2']) {
                this.checkPasswordMatch(this.password, this.password2)
            }
            this.notFirst('pwd1')
        },
        checkPasswordMatch(pass, pass2) {
            const RULE_1 = {
                expression: pass !== pass2,
                name: 'passmatch',
                msg: 'Passwords are not the same'
            }
            validator
                .addRule(RULE_1)
            this.notFirst('pwd2')
        },
        checkForm() {
            this.checkUsername(this.username)
            this.checkPassword(this.password)
            this.checkPasswordMatch(this.password, this.password2)
        },
        register() {
            this.checkForm()
            if (this.isSubmitDisabled) {
                return
            }
            this.registering = true
            this.isFirstRun = true
            Vue.ls.set('pwd', this.password)
            Vue.ls.set('address', this.seed.address)
            const userInfo = {
                encrSeed: seedLib.encryptSeedPhrase(this.seed.phrase, this.password)
            }
            const savedInfo = {
                lastLogin: new Date().getTime(),
                walletAmount: this.addressAmount,
                username: this.username,
                avtHash: this.avatarDataHex,
                sessionTimeout: INITIAL_SESSION_TIMEOUT,
                info: seedLib.encryptSeedPhrase(JSON.stringify(userInfo), this.password)
            }
            window.localStorage.setItem(this.seed.address, JSON.stringify(savedInfo))
            this.$router.push('/')
        },
        registerEnter() {
            this.register()
        },
        minus() {
            if (this.addressAmount > 1) {
                this.addressAmount--
            }
        },
        plus() {
            if (this.addressAmount < 10) {
                this.addressAmount++
            }
        }
    },

    computed: {
        avatarDataHex() {
            return converters.stringToHexString(this.seed.address).split('').reverse().slice(1, 21).join('')
        },
        isSubmitDisabled() {
            return this.isFirstRun === true || this.validator.errors.length > 0
        },
        isEnabled() {
            return this.isFirstRun === false && this.validator.errors.length === 0
        },
        isPassErrors() {
            let errors = this.validator.getErrors('pass')
            return errors && errors.length > 0
        },
        isUsernameErrors() {
            let errors = this.validator.getErrors('username')
            return errors && errors.length > 0
        },
        isPassMatchErrors() {
            let errors = this.validator.getErrors('passmatch')
            return errors && errors.length > 0
        }
    },

    components: {
        VTitle
    }
}
</script>
<style scoped>
.login-forms {
    margin-top: 30px;
    width: 430px;
    max-width: 100%;
    margin-left: 0px;
    margin-right: 0px;
}
.submit-button {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
}
.password-form {
    margin-top: 10px;
}
.avatar {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    border-radius: 10px;
    margin-bottom: auto;
    margin-top: auto;
    width: 64px;
    height: 64px;
}
.avatar-group {
    margin-bottom: 0px;
    width: 100%;
    display: inline-flex;
}
.error-messages {
    margin-top: 10px;
    line-height: 90%;
}
#emailHelp {
    height: 0px;
}
.input-height {
    height: 54px;
}
.btn {
    padding: 0 !important;
}
.pg-bar {
    width: 360px;
    margin-left: 40px;
}
.bar-minus {
    width: 24px;
    height: 24px;
    position: absolute;
    border-radius: 50%;
    margin-top: -4px;
}
.bar-plus {
    width: 24px;
    height: 24px;
    position: absolute;
    margin-left: 420px;
    margin-top: -20px;
    border-radius: 50%;
}
</style>
