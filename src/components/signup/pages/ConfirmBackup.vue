<template>
  <div class="home">
    <v-title
      title="Confirm Backup"
      description="Virify your backup phrase or "
      :goback-act="true"
      @goback="goBack">
    </v-title>
    <textarea
      v-model="seedPhrase"
      ref="wordsToCopy"
      class="hidden"
      readonly></textarea>
    <div class="backup-words-copy container">
      <p>
        Please tap the words in right order
      </p>
      <b-jumbotron class="unselectable wordpad">
        <template v-for="(word, idx) in selectedWords">
          <span
            :key="idx + word + '-selected'"
            class="word container shadow">{{ word }}</span>
          &nbsp;
        </template>
      </b-jumbotron>
      <div class="wordarea">
        <template v-for="(word, idx) in wordList">
          <b-button
            :key="idx"
            v-if="tagFlag[idx]"
            :variant="'warning'"
            :size="'sm'"
            class="shadow-sm unselectable word-btn"
            @click='tapWord(idx)'>
            {{ word }}
          </b-button>
          <b-button
            :key="idx"
            v-else
            :size="'sm'"
            class="shadow-sm unselectable word-btn"
            :disabled="true">
            {{ word }}
          </b-button>
          &nbsp;
        </template>
      </div>
      <div class="error-message">
        {{ errorMsg }}
      </div>
      <b-button
        v-if="!isContinueDisable"
        :variant="'primary'"
        :size="'lg'"
        :block="true"
        href="/">
        Great! Go Ahead!
      </b-button>
      <b-button
        v-if="isContinueDisable"
        :variant="'primary'"
        :size="'lg'"
        :block="true"
        @click="clearWords">
        clear and try again
      </b-button>
      <hr>
      <span
        @click="$router.push('/')"
        class="footer-link">
        Skip this step</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VTitle from '@/components/signup/elements/VTitle'
import Vue from 'vue'
import seedLib from '@/libs/seed.js'

export default {
    name: 'ConfirmBackup',

    data: function() {
        return {
            isContinueDisable: true,
            selectedWords: [],
            tagFlag: [],
            errorMsg: void 0
        }
    },

    mounted() {
        this.tagFlag = Array(this.wordList.length).fill(true)
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
            return this.seedPhrase.split(' ').sort(function(a, b) { return 0.5 - Math.random() })
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
        tapWord(idx) {
            Vue.set(this.tagFlag, idx, false)
            this.selectedWords.push(this.wordList[idx])
            if (this.wordList.length === this.selectedWords.length) {
                this.checkWords()
            }
        },
        clearWords() {
            this.tagFlag = Array(this.wordList.length).fill(true)
            this.selectedWords = []
            this.errorMsg = void 0
        },
        checkWords() {
            const phrases = this.selectedWords.join(' ')
            if (phrases === this.seedPhrase) {
                this.isContinueDisable = false
            } else {
                this.errorMsg = 'Sorry, words are not in the right order, please click the clear button and tap the words in right order.'
            }
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
    background-color: rgb(120, 190, 190);
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
    line-height: 210%;
    min-height: 180px;
}
.wordarea {
    line-height: 200%;
    margin-bottom: 20px;
}
.word-btn {
    margin-top: 10px;
}
.error-message {
    width: 100%;
    min-height: 40px;
    font-size: 80%;
    color: red;
}
</style>
