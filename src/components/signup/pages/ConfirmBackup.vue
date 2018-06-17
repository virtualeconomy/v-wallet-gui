<template>
  <div class="home">
    <v-title
      title="Confirm Backup"
      description="Virify your backup phrase or "
      :goback-act="true"
      @goback="goBack"
    >
    </v-title>
    <textarea
      v-model="seedPhrase"
      ref="wordsToCopy"
      class="hidden"
      readonly
    ></textarea>
    <div class="backup-words-copy container">
      <p>
        Please write these 15 words down in order or
      </p>
      <b-jumbotron class="unselectable wordpad">
        <template v-for="(word, idx) in wordList">
          <span
            :key="idx + word"
            class="word container shadow"
          >{{ word }}</span>
          &nbsp;
        </template>
      </b-jumbotron>
      <br>
      <div class="wordpad">
        <template v-for="(word, idx) in wordList">
          <span
            :key="idx"
            class="word container shadow unselectable"
          >{{ word }}</span>
          &nbsp;
        </template>
      </div>
      <br>
      <b-button
        v-if="!isContinueDisable"
        :variant="'primary'"
        :size="'lg'"
        :block="true"
        href="/">
        Go Ahead!
      </b-button>
      <b-button
        v-if="isContinueDisable"
        :variant="'primary'"
        :size="'lg'"
        :block="true"
      >
        clear tapped words
      </b-button>
      <hr>
      <a
        href="/"
        class="footer-link">Skip this step</a>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VTitle from '@/components/signup/elements/VTitle'
import Vue from 'vue'
import seedLib from '@/libs/seed.js'
import { INITIAL_SESSION_TIMEOUT } from '@/constants.js'

export default {
    name: 'ConfirmBackup',

    data: function() {
        return {
            isContinueDisable: true,
            selectedWords: []
        }
    },

    computed: {
        address() {
            return Vue.ls.get('address')
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        wordList() {
            return this.seedPhrase.split(' ')
        },
        buttonTimeStr() {
            if (this.timeLeft > 0) {
                return '(' + this.timeLeft + 's)'
            }
        }
    },

    methods: {
        goBack() {
            this.$emit('show-page', 'saveBackup')
        },
        goAhead() {
            setTimeout(() => {
                console.log('clear login at ', new Date())
                Vue.ls.clear()
            }, INITIAL_SESSION_TIMEOUT)
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
.hidden {
    font-size: 12pt;
    border: 0px;
    padding: 0px;
    margin: 0px;
    position: absolute;
    left: -9999px;
    top: 0px;
}
.footer-link {
    float: right;
}
.backup-words-copy {
    width: 450px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.word {
    font-size: 100%;
    background-color: rgb(190, 190, 190);
    color: white;
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.wordpad {
    line-height: 200%;
}
</style>
