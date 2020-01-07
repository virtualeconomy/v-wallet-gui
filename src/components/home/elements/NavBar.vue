<template>
  <div>
    <b-navbar
      class="nav-item"
      variant="faded"
      toggleable="lg">
      <b-navbar-brand>
        <img
          class="brand-logo"
          src="@/assets/imgs/icons/wallet/vsys_logo_small.svg">
        <div v-if="networkType === 'T'"
             style="display: inline-block">
          <p style="color: red;font-size: 15px;">(Testnet)</p>
        </div>
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <div class="block"
             v-if="heightStatus">Last Block: {{ currentTime }}
          <span class="time-height">Height: {{ currentHeight }}</span>
        </div>
        <b-nav-item-dropdown right
                             class="drop-down"
                             no-caret>
          <template slot="button-content">
            <div class="row">
              <canvas class="avatar col"
                      width="50"
                      height="50"
                      :data-jdenticon-hash="avtHash"></canvas>
            </div>
          </template>
          <b-dropdown-text class="username">Name: {{ username }}</b-dropdown-text>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item class="drop-down-item"
                           v-b-modal.accountModal>Account</b-dropdown-item>
          <b-dropdown-item class="drop-down-item"
                           v-b-modal.settingsModal>Settings</b-dropdown-item>
          <b-dropdown-item @click="feedbackIssue"
                           class="drop-down-item">Issue & Help</b-dropdown-item>
          <b-dropdown-item class="drop-down-item"
                           v-b-modal.aboutModal>About</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider><b-dropdown-item @click="logout"
                                                                    class="drop-down-item">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <Account :addresses="addresses"
             :address="address"
             :cold-addresses="coldAddresses"
             :get-public-key="getPublicKey"
             :get-private-key="getPrivateKey"
             :get-seed-phrase="getSeedPhrase"
             @delete-cold="deleteCold"></Account>
    <Settings @passParamToParent="updateInterval"
              :set-usr-local-storage="setUsrLocalStorage"
              :address="address"></Settings>
    <About></About>
  </div>

</template>

<script>

import Settings from '../modals/Settings'
import Account from '../modals/Account'
import About from '../modals/About'
import { FEEDBACK_URL } from '@/constants'
import { NETWORK_BYTE } from '@/network'
import Vue from 'vue'
import jdenticon from '@/libs/jdenticon-2.1.0'
import { mapState } from 'vuex'

export default {
    name: 'NavBar',
    components: {
        Settings,
        Account,
        About
    },
    props: {
        username: {
            type: String,
            require: true,
            default: ''
        },
        addresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        address: {
            type: String,
            require: true,
            default: ''
        },
        avtHash: {
            type: String,
            require: true,
            default: ''
        },
        coldAddresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        getPublicKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        getPrivateKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        getSeedPhrase: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        setUsrLocalStorage: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        }
    },
    data() {
        return {
            networkType: String.fromCharCode(NETWORK_BYTE),
            interval: 0,
            currentTime: '',
            currentHeight: 0
        }
    },
    created() {
        if (this.heightStatus) {
            this.updateInterval()
        }
        this.getBlockHeight()
    },
    mounted() {
        jdenticon()
    },
    computed: {
        ...mapState({
            chain: 'chain',
            heightStatus: 'heightStatus'
        })
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = 0
        }
    },
    methods: {
        getBlockHeight() {
            this.chain.getLastBlock().then(response => {
                let tempTime = new Date(response.timestamp / 1e6).toLocaleString()
                window.localStorage.setItem('globalHeight', response.height)
                window.localStorage.setItem('time', tempTime)
                this.currentHeight = response.height
                this.currentTime = tempTime
            }, respErr => {
            })
        },
        updateInterval() {
            if (this.heightStatus) {
                if (this.interval) {
                    clearInterval(this.interval)
                }
                this.interval = setInterval(() => {
                    setTimeout(this.getBlockHeight, 0)
                }, 16000)
            } else {
                if (this.interval) {
                    clearInterval(this.interval)
                    this.interval = 0
                }
            }
        },
        logout() {
            Vue.ls.clear()
            this.$router.push('/login')
        },
        deleteCold(addr) {
            this.$emit('delete-cold', addr)
        },
        feedbackIssue() {
            window.open(FEEDBACK_URL)
        }
    }
}
</script>

<style scoped>
.avatar {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    border-radius: 5px;
    padding: 0px;
    height: 32px;
    width: 32px;
}
.username {
    text-align: center;
    color: #696B8A !important;
    white-space: nowrap;
}
.brand-logo {
    height: 24px;
}
.drop-down {
    margin-right: 30px;
    margin-left: 20px;
}
.drop-down-item {
    text-align: center;
}
.nav-item {
    background-color: rgb(240, 240, 240);
}
.block {
    position: relative;
    display: inline-block;
    margin-top:15px;
    height:19px;
    color: rgba(0, 0, 0, 0.5);
}
.block .time-height{
    height:19px;
    top: 15px;
    color: rgba(0, 0, 0, 0.5);
    z-index: 12;
    visibility: hidden;
}
.block:hover .time-height {
    visibility: visible;
}
</style>
