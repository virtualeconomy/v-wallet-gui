<template>
  <div class="home">
    <div>
      <v-title
        title="Create New Account"
        description="Sign up for a free account below or <a class='vsys-color' href='/restore'>restore your account</a> from backup">
      </v-title>
    </div>
    <div class="login-forms">
      <form class="text-left">
        <div>
          <label>Choose your address avatar</label>
          <p class="amount-tip">Avatar is unique. you can't change it later</p>
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
              <img src="../../../assets/imgs/icons/signup/ico_refresh.svg"> Change one {{ timeLeftToChangeStr }}
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
            class="form-control input-height"
            :class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
            v-model="username"
            placeholder="Create your account name"
            :readonly="registering"
            @input="checkUsername(username)">
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
        <div class="form-group password-form">
          <label>Password</label>
          <input
            type="password"
            name="password"
            class="form-control input-height"
            :class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
            v-model="password"
            placeholder="Set your password"
            :readonly="registering"
            @input="checkPassword(password)">
          <img
            v-if="password && !isPassErrors"
            class="check-right"
            src="../../../assets/imgs/icons/signup/ic_check_green.svg">
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
            class="form-control input-height"
            :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassMatchErrors}"
            v-model="password2"
            :readonly="registering"
            placeholder="Confirm your password"
            @input="checkPasswordMatch(password, password2)"
            @keyup.enter="registerEnter">
        </div>
        <div>
          <img
            id="img_read"
            @click="changeicon"
            src="../../../assets/imgs/icons/signup/ic_select_border.svg">
          I have read and agree to the <a class='vsys-color'
                                          href="#"
                                          target="_blank"
                                          @click="openwin()">Terms of Service<br></a>
          <b-button
            class="input-height"
            :disabled="isSubmitDisabled"
            :variant="'warning'"
            :size="'lg'"
            :block=true
            @click="register">
            Register
          </b-button>
        </div>
      </form>
      <p class="flink">or <a class='vsys-color'
                             href='/login'
      >sign in</a> with a saved account</p>
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
import jdenticon from '@/libs/jdenticon-2.1.0'
import imgread1 from '@/assets/imgs/icons/signup/ic_select_solid.svg'
import imgread2 from '@/assets/imgs/icons/signup/ic_select_border.svg'
export default {
    name: 'CreateAccount',
    data: function() {
        return {
            read_agree: false,
            addressAmount: 1,
            max: 10,
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
        jdenticon()
    },

    watch: {
        avatarDataHex(newHex, oldHex) {
            setTimeout(() => {
                jdenticon()
            }, 0)
        }
    },
    methods: {
        changeicon() {
            if (this.read_agree === false) {
                document.getElementById('img_read').src = imgread1
                this.read_agree = true
            } else {
                document.getElementById('img_read').src = imgread2
                this.read_agree = false
            }
        },
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
            }, this.timeLeftToChange * 1000 + 100)
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
            this.$emit('show-page', 'saveBackup')
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
        },
        openwin() {
            window.open('/terms', '_blank')
        }
    },

    computed: {
        timeLeftToChangeStr() {
            if (this.timeLeftToChange) {
                return '(' + this.timeLeftToChange + ')'
            } else {
                return ''
            }
        },
        avatarDataHex() {
            return converters.stringToHexString(this.seed.address).split('').reverse().slice(1, 21).join('')
        },
        isSubmitDisabled() {
            return this.isFirstRun === true || this.validator.errors.length > 0 || this.read_agree === false
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
<style scoped lang="less">
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
.login-forms {
    width: 560px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.submit-button {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
}
.password-form {
    margin-top: 30px;
}
.username-form {
}
.avatar {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    width: 70px;
    height: 70px;
    border-radius: 10px;
    margin-bottom: auto;
    margin-top: auto;
}
.avatar-group {
    margin-bottom: 10px;
    width: 100%;
    display: inline-flex;
}
.btn-change-avt {
    color: #FF8737;
    background-color: #fff;
    font-size: 0.875rem;
    line-height: 2;
    border-radius: 0.2rem;
    margin-left: 10px;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
    border: 1px solid #FF8737;
}
.btn-change-avt:disabled {
    opacity: 0.65;
}
.error-messages {
    margin-top: 20px;
}
.input-height {
    margin-top: 16px;
    height: 54px;
}
.check-right {
    float: right;
    margin-top: -30px;
    margin-right: 16px;
}
.flink {
    margin-top: 16px;
    margin-bottom: 0px;
}
.amount-tip {
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
.checkmark{

}
.mount-tip {
    font-size: 13px;
    color:#9091A3;
    letter-spacing: 0;
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
