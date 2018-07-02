<template>
  <b-modal id="settingsModal"
           title="Settings">
    <div>
      <div class="lang-setting">
        <label>Language</label>
        <b-form-select class="setting-input"
                       :options="langOptions"
                       v-model="selectedLang"
                       size="sm">
        </b-form-select>
      </div>
      <div class="timeout-setting">
        <label>Session Timeout</label>
        <b-form-select class="setting-input"
                       :options="timeoutOptions"
                       v-model="selectedSession"
                       size="sm"
                       @input="change">
        </b-form-select>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { INITIAL_SESSION_TIMEOUT } from '@/constants.js'
export default {
    name: 'Settings',
    created() {
    },
    props: {
        setUsrLocalStorage: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        address: {
            type: String,
            require: true,
            default: ''
        }
    },
    data() {
        return {
            selectedLang: 'en',
            langOptions: [
                {
                    value: 'en',
                    text: 'EN'
                },
                {
                    value: 'cn',
                    text: 'CN'
                }
            ],
            selectedSession: this.getSelectedSession() / 1000 / 60,
            timeoutOptions: [
                {
                    value: 5,
                    text: '5 min'
                },
                {
                    value: 10,
                    text: '10 min'
                },
                {
                    value: 20,
                    text: '20 min'
                },
                {
                    value: 40,
                    text: '40 min'
                },
                {
                    value: 60,
                    text: '1 hour'
                }
            ]
        }
    },
    methods: {
        change: function(selected) {
            this.setUsrLocalStorage('sessionTimeout', selected * 60 * 1000)
        },
        getSelectedSession() {
            let oldTimeout = INITIAL_SESSION_TIMEOUT
            try {
                oldTimeout = JSON.parse(window.localStorage.getItem(this.address)).sessionTimeout
            } catch (e) {
                oldTimeout = INITIAL_SESSION_TIMEOUT
            }
            return oldTimeout
        }
    }
}
</script>

<style scoped>
. setting-input {
    width: 100px;
    margin-left: 20px;
}

</style>
