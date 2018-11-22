<template>
  <div class="layout-main">
    <div class="container logo">
      <img
        class="brand-logo"
        src="../assets/imgs/icons/signup/vee_logo.svg">
    </div>
    <div class="form-login">
      <H1>
        Sign in
      </H1>
      <p>Sign in or <b-button
        class="blink"
        @click="changePage('/signup')"
        variant="link">
        create a new account
      </b-button>
      </p>
      <hr class="hr-login">
      <div
        class="dropdown v-select"
        :class="dropdownClasses"
        v-if="mutableValue">
        <div
          ref="toggle"
          @mousedown.prevent="toggleDropdown"
          class="dropdown-toggle container">
          <div class="selected-tag container">
            <div class="div-avatar">
              <canvas
                class="avatar"
                width="50"
                height="50"
                v-if="mutableValue"
                :data-jdenticon-hash="mutableValue.avt"
              ></canvas>
            </div>
            <div v-if="mutableValue">
              <div class="usrname">
                {{ mutableValue.usrname }}
              </div>
              <div class="addr">
                {{ mutableValue.addr }}
              </div>
            </div>
          </div>
          <i
            ref="openIndicator"
            class="open-indicator"></i>
        </div>
        <transition name="fade">
          <ul
            ref="dropdownMenu"
            v-show="dropdownOpen"
            class="dropdown-menu animated"
            :class="faded">
            <li
              v-for="(option, index) in usrOptions"
              :key="index"
              :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }"
              @mouseover="typeAheadPointer = index">
              <a @mousedown.prevent="select(option)">
                <slot
                  name="option"
                  v-bind="option">
                  <div class="div-avatar">
                    <canvas
                      class="avatar"
                      width="50"
                      height="50"
                      :data-jdenticon-hash="option.avt"
                    ></canvas>
                  </div>
                  <div class="container">
                    <div class="usrname">
                      {{ option.usrname }}
                    </div>
                    <div class="addr">
                      {{ option.addr }}
                    </div>
                  </div>
                </slot>
              </a>
            </li>
          </ul>
        </transition>
      </div>
      <div v-else>
        <b-form-input readonly
                      size="lg"
                      class="h-input"
                      value="If it's your first time login, please create an account">
        </b-form-input>
      </div>
      <div class="input-pwd">
        <b-form-input
          class="h-input"
          @input="hideErrMsg"
          @keyup.enter.native="login"
          v-model="password"
          type="password"
          placeholder="Password"
          size="lg">
        </b-form-input>
      </div>
      <div
        class="msg-err text-danger"
        v-show="isPwdError">
        <small>
          Password is wrong.
          <a
            class='vee-color'
            href="/restore"> Forget your password? </a>
        </small>
      </div>
      <div class="submit-button">
        <b-button
          class="h-input btn-color"
          :variant="'warning'"
          :size="'lg'"
          :block=true
          @click="login"
        ><b>Login</b>
        </b-button>
      </div>
      <p class="flink">
        Already have an account ?
        <b-button
          class="blink"
          @click="changePage('/restore')"
          variant="link">
          restore account
        </b-button>
        from backup
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ADDRESS_LENGTH } from '../constants.js'
import seedLib from '@/libs/seed.js'
import jdenticon from '@/libs/jdenticon-2.1.0'

export default {
    name: 'Login',

    data: function() {
        return {
            selectedAddr: '',
            mutableValue: void 0,
            dropdownOpen: false,
            typeAheadPointer: -1,
            isPwdError: false,
            password: void 0,
            faded: 'slideInDown',
            thetxt: 'gasjgkldsjkalng'
        }
    },

    created() {
        Vue.ls.clear()
        const strg = window.localStorage
        this.usrOptions = Object.keys(strg).reduce((ac, addr) => {
            if (addr.length === ADDRESS_LENGTH) {
                try {
                    const usrStr = strg[addr]
                    const usrObj = JSON.parse(usrStr)
                    if (usrObj && usrObj['username'] && usrObj['avtHash'] && usrObj['lastLogin']) {
                        const usr = {
                            addr: addr,
                            usrname: usrObj['username'],
                            avt: usrObj['avtHash'],
                            sort: usrObj['lastLogin']
                        }
                        ac.push(usr)
                    }
                } catch (err) {
                    return ac
                }
            }
            return ac
        }, []).sort((usr1, usr2) => {
            return usr2.sort - usr1.sort
        }).slice(0, 20)
        this.selectedAddr = this.usrOptions[0]
        this.mutableValue = this.usrOptions[0]
        /*
        if (!this.usrOptions.length) {
            this.$router.push('/signup')
        }
        */
    },

    mounted() {
        jdenticon()
    },

    computed: {

        dropdownClasses() {
            return {
                open: this.dropdownOpen,
                single: true
            }
        },

        valueAsArray() {
            if (this.mutableValue) {
                return [this.mutableValue]
            }
            return []
        }
    },

    watch: {
        typeAheadPointer() {
            this.maybeAdjustScroll()
        },
        mutableValue() {
            window.setTimeout(() => {
                jdenticon()
            }, 0)
        },
        dropdownOpen() {
            window.setTimeout(() => {
                jdenticon()
            }, 0)
        }
    },

    methods: {

        changePage(route) {
            this.$router.push(route)
        },

        toggleDropdown(e) {
            this.faded = (this.dropdownOpen ? 'slideOutUp' : 'slideInDown')
            this.dropdownOpen = !this.dropdownOpen
        },

        isOptionSelected(option) {
            return this.mutableValue === option
        },

        select(option) {
            this.mutableValue = option
            this.onAfterSelect(option)
        },

        onAfterSelect(option) {
            this.dropdownOpen = !this.dropdownOpen
        },

        maybeAdjustScroll() {
            let pixelsToPointerTop = this.pixelsToPointerTop()
            let pixelsToPointerBottom = this.pixelsToPointerBottom()

            if (pixelsToPointerTop <= this.viewport().top) {
                return this.scrollTo(pixelsToPointerTop)
            } else if (pixelsToPointerBottom >= this.viewport().bottom) {
                return this.scrollTo(this.viewport().top + this.pointerHeight())
            }
        },

        pixelsToPointerTop() {
            let pixelsToPointerTop = 0
            if (this.$refs.dropdownMenu) {
                for (let i = 0; i < this.typeAheadPointer; i++) {
                    pixelsToPointerTop += this.$refs.dropdownMenu.children[i].offsetHeight
                }
            }
            return pixelsToPointerTop
        },

        pixelsToPointerBottom() {
            return this.pixelsToPointerTop() + this.pointerHeight()
        },

        pointerHeight() {
            let element = this.$refs.dropdownMenu ? this.$refs.dropdownMenu.children[this.typeAheadPointer] : false
            return element ? element.offsetHeight : 0
        },

        viewport() {
            return {
                top: this.$refs.dropdownMenu ? this.$refs.dropdownMenu.scrollTop : 0,
                bottom: this.$refs.dropdownMenu ? this.$refs.dropdownMenu.offsetHeight + this.$refs.dropdownMenu.scrollTop : 0
            }
        },

        scrollTo(position) {
            if (this.$refs.dropdownMenu) {
                this.$refs.dropdownMenu.scrollTop = position
                return position
            }
            return null
        },

        checkPassword() {
            try {
                seedLib.decryptSeedPhrase(
                    JSON.parse(
                        seedLib.decryptSeedPhrase(
                            JSON.parse(
                                window.localStorage.getItem(
                                    this.mutableValue.addr)).info,
                            this.password)).encrSeed,
                    this.password)
                this.isPwdError = false
            } catch (err) {
                this.isPwdError = true
            }
        },

        login() {
            this.checkPassword()
            if (this.isPwdError) {
                return
            }
            Vue.ls.set('pwd', this.password)
            Vue.ls.set('address', this.mutableValue.addr)
            this.$router.push('/')
        },

        hideErrMsg() {
            this.isPwdError = false
        }
    }
}
</script>

<style scoped lang="less">
@import '../assets/style/variables';
@import '../assets/style/common';
.layout-main {
    width: 100%;
    height: 100%;
    min-width: 200px;
    background-color: rgb(249, 249, 249);
}
.logo {
    padding-top: 74px;
    width: 100%;
    vertical-align: middle;
}
.hr-login {
    margin-top: 30px;
}
.form-login {
    margin-top: 35px;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 50px;
    border:1px solid #EDEEF2;
    border-radius: 4px;
    background-color: white;
}
.addr {
    font-size: 80%;
    line-height: 70%;
    color: rgb(170, 170, 170);
}
.selecting {
    font-size: 50%;
}
.usrname {
    font-size: 120%;
    line-height: 130%;
}
.avatar {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    border-radius: 5px;
    padding: 0px;
    height: 45px;
    width: 45px;
}
.div-avatar {
    float: left;
    padding-right: 10px;
}
.addr {
    margin-top: 5px;
    width: 100%;
}
.v-select {
    position: relative;
    font-family: sans-serif;
    margin-top: 40px;
}
.v-select, .v-select * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.v-select .open-indicator {
    position: absolute;
    bottom: 15px;
    right: 10px;
    display: inline-block;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    opacity: 1;
    height: 20px; width: 10px;
}
.v-select .open-indicator:before {
    border-color: rgba(60, 60, 60, .5);
    border-style: solid;
    border-width: 3px 3px 0 0;
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    vertical-align: top;
    transform: rotate(133deg);
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    box-sizing: inherit;
}
.v-select.open .open-indicator:before {
    transform: rotate(315deg);
}
.v-select.loading .open-indicator {
    opacity: 0;
}
.v-select.open .open-indicator {
    bottom: 9px;
}
.v-select .dropdown-toggle {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: block;
    padding: 0;
    background: none;
    border: 1px solid rgba(60, 60, 60, .26);
    border-radius: 4px;
    white-space: normal;
    cursor: pointer;
}
.v-select .dropdown-toggle:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
.v-select.open .dropdown-toggle {
    border-bottom-width: 0.5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.v-select .dropdown-menu {
    display:block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 160px;
    padding: 5px 0;
    margin: 0;
    width: 100%;
    overflow-y: scroll;
    border: 1px solid rgba(0, 0, 0, .26);
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,.15);
    border-top: none;
    border-radius: 0 0 4px 4px;
    text-align: left;
    list-style: none;
    background: #fff;
    max-height: 400px;
}
.v-select .selected-tag {
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 4px 1px 0px 3px;
    padding: 1px 0.25em;
    text-align: left;
}
.v-select.single .selected-tag {
    background-color: transparent;
    border-color: transparent;
}
.v-select li {
    line-height: 1.42857143;
    border-bottom: 0.5px solid rgb(230,230,230);
}
.v-select li > a {
    display: block;
    padding: 10px 10px;
    clear: both;
    color: #333;
    white-space: nowrap;
}
.v-select li:hover {
    cursor: pointer;
}
.v-select .dropdown-menu .active > a {
    color: #333;
    background: rgba(50, 50, 50, .1);
}
.v-select .dropdown-menu > .highlight > a {
    background: rgba(254, 124, 59, 0.4);
    color: rgba(0, 0, 0, 0.7);
}
.v-select .dropdown-menu > .highlight > a .addr {
    color: rgba(0, 0, 0, 0.4);
}
.v-select .highlight:not(:last-child) {
    margin-bottom: 0; /* Fixes Bulma Margin */
}
.v-select .spinner {
    opacity: 0;
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 5px;
    text-indent: -9999em;
    overflow: hidden;
    border-top: .9em solid rgba(100, 100, 100, .1);
    border-right: .9em solid rgba(100, 100, 100, .1);
    border-bottom: .9em solid rgba(100, 100, 100, .1);
    border-left: .9em solid rgba(60, 60, 60, .45);
    transform: translateZ(0);
    animation: vSelectSpinner 1.1s infinite linear;
    transition: opacity .1s;
}
.v-select .spinner,
.v-select .spinner:after {
    border-radius: 50%;
    width: 5em;
    height: 5em;
}
@-webkit-keyframes vSelectSpinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes vSelectSpinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity .15s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.input-pwd {
    padding-top: 30px;
}
.msg-err {
    margin-top: 10px;
    height: 10px;
}
.h-input {
    height: 58px;
}
.submit-button {
    margin-top: 30px;
}
.btn-link {
    color: @veeColor !important;
}
.blink {
    padding-top: 3px;
    padding-left: 0px;
    padding-right: 0px;
}
.flink {
    margin-top: 20px;
}
.hput {
    font-size: 14px;
}
</style>
