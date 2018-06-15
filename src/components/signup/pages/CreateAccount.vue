<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
    <div class="login-forms">
      <div class="container">
        <v-title
          title="Create a new account"
          description="signup for a new account below or you can <a href='/restore'>restore your account</a> from a backup"
        >
        </v-title>
      </div>
      <hr>
      <form class="text-left container">
        <div>
          <label>Avatar</label>
          <div class="avatar-group">
            <img
              :src="'data:image/png;base64,'+avatarData"
              alt="blank"
              class="avatar">
            <canvas
              class="avatar"
              width="120"
              height="120"
              :data-jdenticon-hash="avataDataHex"
            >
              Fallback text for browsers not supporting canvas
            </canvas>
            <button
              class="btn-change-avt btn-primary btn-sm"
              type="button"
              :disabled="!avatarCanChange"
              @click="changeAvatar()"
            >
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
            @input="checkPasswordMatch(password, password2)">
        </div>
        <div class="form-group submit-button">
          <b-button
            :disabled="isSubmitDisabled"
            :variant="'primary'"
            :size="'lg'"
            :block=true
            @click="register">Registration
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/home/NavBar'
import VTitle from '@/components/signup/elements/VTitle'

import seedLib from '@/libs/seed.js'
import Identicon from '@/libs/identicon.js'
import converters from '@/libs/converters.js'
import validator from 'vue-m-validator'
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
            validator: validator
        }
    },

    created() {
        validator.reset()
    },
    mounted() {
        console.log('mounted')
        window.jdenticon()
    },
    watch: {
        avataDataHex(newHex, oldHex) {
            console.log(this.avataDataHex)
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
                msg: 'Your passowrd must contain at least 1 alphabetical character'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
                .addRule(RULE_3)
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
            console.log('registration')
            console.log(this.seed)
            console.log(this.username, this.password)
        }
    },
    computed: {
        timeLeftToChangeStr() {
            if (this.timeLeftToChange) {
                return '(' + this.timeLeftToChange + ')'
            }
        },
        avatarData() {
            var options = {
                foreground: [242, 132, 0, 255],
                background: [255, 255, 255, 255],
                margin: 0,
                size: 120,
                format: 'png'
            }
            return new Identicon(this.seed.address, options).toString()
        },
        avataDataHex() {
            return converters.stringToHexString(this.seed.address)
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
        NavBar,
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
    margin-top: 0px;
    width: 120px;
    height: 120px;
    border-radius: 10px;
}
.avatar-group {
    margin-bottom: 30px;
}
.btn-change-avt {
    margin-left: 5px;
    margin-bottom: 0px;
}
.error-messages {
    margin-top: 20px;
}
</style>
