<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
    <div>
      <v-title
        title="Create a new account"
        description="signup for a new account below or you can <a href='#'>restore your account</a> from a backup"
      >
      </v-title>
    </div>

    <form class="text-left">
      <ul class="form-group">
        <li
          v-for="error in validator.errors"
          :key="error.msgs.toString()">
          <small
            class="form-text text-muted"
            v-for="msg in error.msgs"
            :key="msg">
            {{ msg }}
          </small>
        </li>
      </ul>
      <div class="form-group">
        <label>Username</label>
        <input
          type="text"
          class="form-control"
          :class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
          v-model="username"
          placeholder="Enter username"
          @blur="checkUsername(username)">
        <ul v-if="isUsernameErrors">
          <li
            class="form-text text-danger"
            v-for="error in validator.getErrors('username')"
            :key="error">
            &nbsp;{{ error }}
          </li>
        </ul>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          class="form-control"
          :class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
          placeholder="Password"
          v-model="password"
          @blur="checkPassword(password)">
        <small
          id="emailHelp"
          class="form-text text-muted">
          At least 8 characters
        </small>
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassErrors}"
          placeholder="Password again"
          v-model="password2"
          @blur="checkPasswordMatch(password, password2)">
        <ul>
          <li
            class="form-text text-danger"
            v-for="error in validator.getErrors('pass')"
            :key="error"
          >
            &nbsp;{{ error }}
          </li>
        </ul>
      </div>
      <div class="form-group" >
        <button
          v-if="isDisabled"
          type="button"
          class="btn btn-primary"
          disabled>Registration</button>
        <button
          v-if="isEnabled"
          type="button"
          class="btn btn-primary"
          @click="register">Registration</button>
      </div>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/home/NavBar'
import VTitle from '@/components/signup/elements/VTitle'

import seedLib from '@/libs/seed.js'
import Identicon from '@/libs/identicon.js'
import validator from 'vue-m-validator'
export default {
    name: 'CreateAccount',

    data: function() {
        return {
            vTitleTitle: 'CreateAccount',
            vTitleDescription: '',
            isFirstRun: true,
            username: '',
            password: '',
            password2: '',
            validator: validator
        }
    },

    created() {
        console.log(validator)
        const seed = seedLib.create()
        const password = 'aaaaaaaa'
        console.log(seed)
        const encriptedSeed = seedLib.encryptSeedPhrase(seed.phrase, password)
        console.log(encriptedSeed)
        const decriptedSeed = seedLib.decryptSeedPhrase(encriptedSeed, password)
        console.log(decriptedSeed)
        const avatarData = new Identicon('d3b07384d113edec49eaa6238ad5ff00', 420)
        console.log(avatarData)
        validator.reset()
    },
    methods: {
        notFirst() {
            this.isFirstRun = false
        },
        checkUsername(_username) {
            const USERNAME = _username.trim()
            const RULE_1 = {
                expression: !USERNAME || USERNAME === '',
                name: 'username',
                msg: 'username field required'
            }
            const RULE_2 = {
                expression: /[\d\-+\\.,/()*&^%$#@!~?{};:<>|]/.test(USERNAME),
                name: 'username',
                msg: 'username is not valid'
            }
            const RULE_3 = {
                expression: USERNAME.length > 128,
                name: 'username',
                msg: 'username is too long'
            }
            const RULE_4 = {
                expression: USERNAME.length < 3 && USERNAME.length !== 0,
                name: 'username',
                msg: 'username is too short'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
                .addRule(RULE_3)
                .addRule(RULE_4)
            this.notFirst()
        },
        checkPassword(pass) {
            const RULE_1 = {
                expression: !pass || pass === '',
                name: 'pass',
                msg: 'pass field required'
            }
            const RULE_2 = {
                expression: pass.length < 8,
                name: 'pass',
                msg: 'Your password should be of at least 8 characters'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
            this.notFirst()
        },
        checkPasswordMatch(pass, pass2) {
            const RULE_1 = {
                expression: pass !== pass2,
                name: 'passmatch',
                msg: 'Passwords do not match'
            }
            validator
                .addRule(RULE_1)
            this.notFirst()
        },
        checkForm() {
            this.checkUsername(this.username)
            this.checkPassword(this.password)
            this.checkPasswordMatch(this.password, this.password2)
        },
        register() {
            this.checkForm()
            console.log('registration')
        }
    },
    computed: {
        isDisabled() {
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
@import '../../../assets/style/common.less';
.home {
    width: 100%;
    height: 100%;
}
.nav {
    width: 100%;
    height: 86px;
}

</style>
