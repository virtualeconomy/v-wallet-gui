<template>
  <b-modal id="settingsModal"
           title="Settings">
    <div>
      <div class="lang-setting">
        <label>Language</label>
        <b-form-select class="setting-input"
                       :options="langOptions"
                       size="sm">
        </b-form-select>
      </div>
      <div class="timeout-setting">
        <label>Session Timeout</label>
        <b-form-select class="setting-input"
                       :options="timeoutOptions"
                       size="sm"
                       @input="change">
        </b-form-select>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
    name: 'Settings',
    props: {
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
            selected: null,
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
            timeoutOptions: [
                {
                    value: '5',
                    text: '5 min'
                },
                {
                    value: '10',
                    text: '10 min'
                },
                {
                    value: '20',
                    text: '20 min'
                },
                {
                    value: '40',
                    text: '40 min'
                },
                {
                    value: '60',
                    text: '1 hour'
                }
            ]
        }
    },
    methods: {
        change: function(selected) {
            this.setUsrLocalStorage('sessionTimeout', selected)
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
