<template>
  <div class="home">
    <div>
      <v-title
        title="Create a new account"
        description="signup for a new account below or you can <a href='/restore'>restore your account</a> from a backup">
      </v-title>
    </div>
    <div class="login-forms">
      <form class="text-left container">
        <div>
          <label>Avatar</label>
          <div class="avatar-group">
            <!-- <img
              :src="'data:image/png;base64,'+avatarData"
              alt="blank"
              class="avatar"> -->
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
            placeholder="Enter username"
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
            placeholder="Password"
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
            placeholder="Password again"
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
      </form>
      <hr>
      <a
        href="/login"
        class="footer-link"><small>Login</small></a>
    </div>
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

export default {
    name: 'CreateAccount',

    data: function() {
        return {
            vTitleTitle: 'CreateAccount',
            vTitleDescription: '',
            isFirstRun: true,
            isFirst: {
                'username': true,
                'pwd1': true,
                'pwd2': true
            },
            username: '',
            password: '',
            password2: '',
            seed: seedLib.create(),
            avatarCanChange: true,
            timeLeftToChange: void 0,
            validator: validator,
            registering: false
        }
    },

    created() {
        validator.reset()
    },

    mounted() {
        window.jdenticon()
    },

    watch: {
        avatarDataHex(newHex, oldHex) {
            setTimeout(() => {
                window.jdenticon()
            }, 0)
        }
    },

    methods: {
        changeAvatar() {
            this.seed = seedLib.create()
            this.avatarCanChange = false
            this.timeLeftToChange = 3
            const avtChangeTimer = setInterval(() => {
                this.timeLeftToChange = this.timeLeftToChange - 1
            }, 1000)
            setTimeout(() => {
                this.avatarCanChange = true
                clearInterval(avtChangeTimer)
            }, this.timeLeftToChange * 1000)
        },
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
                pubKey: this.seed.keyPair.publicKey,
                encrSeed: seedLib.encryptSeedPhrase(this.seed.phrase, this.password)
            }
            const savedInfo = {
                lastLogin: new Date().getTime(),
                username: this.username,
                avtHash: this.avatarDataHex,
                sesstionTimeout: INITIAL_SESSION_TIMEOUT,
                info: seedLib.encryptSeedPhrase(JSON.stringify(userInfo), this.password)
            }
            // clear session in home
            // setTimeout(() => {
            //     Vue.ls.clear()
            // }, INITIAL_SESSION_TIMEOUT)
            window.localStorage.setItem(this.seed.address, JSON.stringify(savedInfo))
            this.$emit('show-page', 'saveBackup')
        },
        registerEnter() {
            this.register()
        }
    },

    computed: {
        timeLeftToChangeStr() {
            if (this.timeLeftToChange) {
                return '(' + this.timeLeftToChange + ')'
            }
        },
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
.home {
    width: 100%;
    height: 100%;
}
.nav {
    width: 100%;
    height: 86px;
}
.login-forms {
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.submit-button {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
}
.password-form {
    margin-top: 25px;
}
.username-form {
}
.avatar {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    width: 120px;
    height: 120px;
    border-radius: 10px;
    margin-bottom: auto;
    margin-top: auto;
}
.avatar-group {
    margin-bottom: 10px;
    height: 120px;
    width: 100%;
    display: inline-flex;
}
.btn-change-avt {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    margin-left: 10px;
    margin-top: auto;
    margin-bottom: 0px;
    cursor: pointer;
}
.btn-change-avt:disabled {
    opacity: 0.65;
}
.error-messages {
    margin-top: 20px;
}
.footer-link {
    float: right;
}
</style>
