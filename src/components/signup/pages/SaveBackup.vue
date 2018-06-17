<template>
  <div class="home">
    <v-title
      title="Save backup phrase"
      description="Treat your backup phrase with care. You can also find these words in your private profile after logging in"
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
        <br>
        <b-button
          id="btn-cpy"
          :disabled="isCpyDisable"
          v-b-popover.click="'copied'"
          @click="copyWords"
          variant="link">
          copy them
        </b-button>
      </p>
      <b-jumbotron class="unselectable">
        <template v-for="(word, idx) in wordList">
          <span
            :key="idx"
            class="word container shadow"
          >{{ word }}</span>
          &nbsp;
        </template>
      </b-jumbotron>
      <br>
      <b-button
        :disabled="isContinueDisable"
        :variant="'primary'"
        :size="'lg'"
        :block=true
        @click="confirmPage">
        Continue to confirm {{ buttonTimeStr }}
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

export default {
    name: 'SaveBackup',

    data: function() {
        return {
            isContinueDisable: true,
            timeToContinue: 5,
            timeLeft: 5,
            isCpyDisable: false
        }
    },

    mounted() {
        console.log('addr', this.address)
        console.log('usrInf', this.userInfo)
        console.log('scrInf', this.secretInfo)
        console.log('seedPhrase', this.wordList)
        const interval = setInterval(() => {
            this.timeLeft -= 1
        }, 1000)
        setTimeout(() => {
            clearInterval(interval)
            this.isContinueDisable = false
        }, this.timeToContinue * 1000)
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
        copyWords() {
            this.$refs.wordsToCopy.select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', 'btn-cpy')
            this.isCpyDisable = true
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', 'btn-cpy')
                this.isCpyDisable = false
            }, 800)
        },
        confirmPage() {
            this.$emit('show-page', 'confirmBackup')
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
    border: 2px solid rgb(160, 160, 160);
    border-radius: 5px;
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
    line-height: 200%;
}
</style>
