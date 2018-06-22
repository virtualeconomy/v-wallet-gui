<template>
  <div>
    <b-navbar fixed="top"
              type="light"
              variant="faded"
              toggleable>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand class="brand-logo">
        <img src="../../../assets/imgs/logo-small.png">
      </b-navbar-brand>
      <b-collapse is-nav
                  visible
                  id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item-dropdown text="User"
                               class="user-account">
            <b-dropdown-item v-b-modal.accountModal>
              Account
            </b-dropdown-item>
            <b-dropdown-item v-b-modal.settingsModal>
              Settings
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              Logout
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Account :wallet-address="walletAddress"></Account>
    <Settings></Settings>
  </div>

</template>

<script>

import Settings from '../modals/Settings'
import Account from '../modals/Account'
import Vue from 'vue'

export default {
    name: 'NavBar',
    components: {
        Settings,
        Account
    },
    props: {
        walletAddress: {
            type: String,
            require: true,
            default: ''
        },
        coldAddress: {
            type: String,
            require: true,
            default: ''
        },
        pubKey: {
            type: String,
            require: true,
            default: ''
        },
        priKey: {
            type: String,
            require: true,
            default: ''
        },
        seed: {
            type: String,
            require: true,
            default: ''
        }
    },
    computed: {
    },
    methods: {
        logout() {
            console.log('logout')
            Vue.ls.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
.brand-logo {
    float: left;
    margin-left: 20px;
    margin-top: 4px;
}
</style>
