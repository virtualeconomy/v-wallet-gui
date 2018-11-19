<template>
  <div>
    <b-navbar
      class="nav-item"
      variant="faded"
      toggleable>
      <b-navbar-toggle target="nav_collapse" ></b-navbar-toggle>
      <b-navbar-brand>
        <img
          class="brand-logo"
          src="../../../assets/imgs/icons/wallet/vee_logo_small.svg">
      </b-navbar-brand>
      <b-collapse is-nav
                  id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            right
            no-caret>
            <template slot="button-content">
              <div class="row username">
                <span class="col align-self-center">{{ username }}</span>
                <canvas
                  class="avatar col"
                  width="50"
                  height="50"
                  :data-jdenticon-hash="avtHash"
                ></canvas>
              </div>
            </template>
            <b-dropdown-item v-b-modal.accountModal>
              Account
            </b-dropdown-item>
            <b-dropdown-item v-b-modal.settingsModal>
              Settings
            </b-dropdown-item>
            <b-dropdown-item v-b-modal.aboutModal>
              About
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout">
              Logout
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Account :addresses="addresses"
             :address="address"
             :cold-addresses="coldAddresses"
             :get-pub-key="getPubKey"
             :get-pri-key="getPriKey"
             :get-seed-phrase="getSeedPhrase"
             @delete-cold="deleteCold"></Account>
    <Settings :set-usr-local-storage="setUsrLocalStorage"
              :address="address"></Settings>
    <About :set-usr-local-storage="setUsrLocalStorage"
           :address="address"></About>
  </div>

</template>

<script>

import Settings from '../modals/Settings'
import Account from '../modals/Account'
import About from '../modals/About'

import Vue from 'vue'
import jdenticon from '@/libs/jdenticon-2.1.0'

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
        getPubKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        getPriKey: {
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
    mounted() {
        jdenticon()
    },
    computed: {
    },
    methods: {
        logout() {
            Vue.ls.clear()
            this.$router.push('/login')
        },
        deleteCold(addr) {
            this.$emit('delete-cold', addr)
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
    display: inline-block;
}
.brand-logo {
    height: 24px;
}
.nav-item {
    background-color: rgb(240, 240, 240);
}
</style>
