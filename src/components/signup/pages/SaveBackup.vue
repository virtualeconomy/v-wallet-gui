<template>
  <div class="home">
    <v-title
      title="Save backup phrase"
      description="You must save the secret phrase. It is crucial for accessing your account.">
    </v-title>
    <textarea
      v-model="seedPhrase"
      ref="wordsToCopy"
      class="hidden"
      readonly>
    </textarea>
    <div class="backup-words-copy">
      <p>
        Please write these 15 words down in order or
        <b-button
          id="btn-cpy"
          :disabled="isCpyDisable"
          v-b-popover.click="'copied'"
          @click="copyWords"
          variant="link">
          copy them
        </b-button>
      </p>
      <div class="word-container unselectable">
        <template v-for="(word, idx) in wordList">
          <span
            :key="idx"
            class="word">
            {{ word }}
          </span>
          &nbsp;
        </template>
      </div>
      <br>
      <b-button
        :disabled="isContinueDisable"
        :variant="'warning'"
        :size="'lg'"
        :block=true
        @click="confirmPage">
        Continue to confirm {{ buttonTimeStr }}
      </b-button>
      <div @click="gotoHomePage"
           class="footer-link">skip this step</div>
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
        const interval = setInterval(() => {
            this.timeLeft -= 1
        }, 1000)
        setTimeout(() => {
            clearInterval(interval)
            this.isContinueDisable = false
        }, this.timeToContinue * 1000 + 100)
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
        },
        gotoHomePage() {
            this.$router.push('/')
        }
    },

    components: {
        VTitle
    }
}
</script>
<style scoped>
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
    margin-top: 20px;
    cursor: pointer;
    color: #FF8737;
    display: -webkit-inline-box;
}
.footer-link:hover {
    text-decoration: underline;
}
.backup-words-copy {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.word {
    font-size: 17px;
    color: #181B3A;
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    line-height: 200%;
}
#btn-cpy {
    padding-left: 0px;
}
.word-container {
    padding: 30px 20px;
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
}
</style>
