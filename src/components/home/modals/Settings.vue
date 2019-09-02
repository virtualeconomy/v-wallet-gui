<template>
  <b-modal id="settingsModal"
           title="Settings"
           ref="settingModal"
           centered
           hide-header
           hide-footer
           ok-only
           @hide="resetSession">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="div-set">
      <div class="lang-setting div-t">
        <label class="label-st">Language</label>
        <b-form-select class="setting-input"
                       :options="langOptions"
                       v-model="selectedLang"
                       :disabled="true"
                       size="sm">
        </b-form-select>
      </div>
      <div class="timeout-setting div-t">
        <label class="label-st">Session Timeout</label>
        <b-form-select class="setting-input"
                       :options="timeoutOptions"
                       v-model="selectedSession"
                       size="sm">
        </b-form-select>
      </div>
      <div class="timeout-setting div-t">
        <input class="show-height"
               type="checkbox"
               v-model="heightStatus"
               @click="showHeight">
        <label class="label-st">Show Current Block Height</label>
      </div>
      <div class="timeout-setting div-t">
        <input class="enable-function"
               type="checkbox"
               v-model="curManagementStatus"
               @click="enableTokenManagement">
        <label class="label-st">Enable Token Management Functionality</label>
      </div>
      <div class="timeout-setting div-t">
        <input class="enable-function"
               type="checkbox"
               v-model="curSplitStatus"
               @click="enableTokenSplit">
        <label class="label-st">Enable Token Split/Revert Functionality</label>
      </div>
    </div>
    <b-row class="btn-bottom">
      <b-col class="col-lef">
        <b-button
          class="btn-back"
          block
          variant="light"
          size="lg"
          @click="closeModal">Cancel
        </b-button>
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          @click="confirm(); passParamToParent();">Confirm
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { INITIAL_SESSION_TIMEOUT } from '@/constants.js'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'Settings',
    created() {
        this.curManagementStatus = this.tokenManagementStatus
        this.curSplitStatus = this.tokenSplitStatus
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
            heightStatus: this.getHeightStatus(),
            curSplitStatus: this.tokenSplitStatus,
            curManagementStatus: this.tokenManagementStatus,
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
            selectedSession: this.getSelectedSession(),
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
    computed: {
        ...mapState({
            tokenManagementStatus: 'tokenManagementStatus',
            tokenSplitStatus: 'tokenSplitStatus'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        }
    },
    methods: {
        showEnableSplitWarningMsgBox() {
            this.$bvModal.msgBoxConfirm('WARNING: Split/Reverse-Split is an experimental token feature requiring exchange support compatible with Unity Token Split Protocol. The proper use of token with split functionality requires due diligence of both the token issuer and the supporting exchanges. Token issuer shall agree to abide by the protocol and convention of proper use of the split/reverse-split functionality. Token issuer shall agree to defend, hold harmless, and indemnify V Systems Limited for damage and loss involving the use of split/reverse-split functionality of the token.', {
                okVariant: 'warning',
                okTitle: 'I agree',
                cancelTitle: 'I do not agree',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
                .then(value => {
                    this.curSplitStatus = value
                })
        },
        ...mapActions(['changeEnableStatus', 'changeSettingsStatus']),
        changeSession() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, 'sessionTimeout', this.selectedSession)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        showHeight() {
            if (!this.heightStatus) this.heightStatus = true
            else this.heightStatus = false
        },
        changeHeightStatus() {
            window.localStorage.setItem('heightStatus', this.heightStatus)
        },
        getHeightStatus() {
            let oldHeightStatus = false
            try {
                oldHeightStatus = JSON.parse(window.localStorage.getItem('heightStatus'))
            } catch (e) {
            }
            return oldHeightStatus
        },
        enableTokenManagement() {
            if (!this.curManagementStatus) this.curManagementStatus = true
            else this.curManagementStatus = false
        },
        enableTokenSplit() {
            if (!this.curSplitStatus) {
                this.showEnableSplitWarningMsgBox()
            } else {
                this.curSplitStatus = false
            }
        },
        getSelectedSession() {
            let oldTimeout = INITIAL_SESSION_TIMEOUT
            try {
                oldTimeout = JSON.parse(window.localStorage.getItem(this.address)).sessionTimeout
            } catch (e) {
            }
            return oldTimeout
        },
        closeModal() {
            this.$refs.settingModal.hide()
        },
        passParamToParent() {
            this.$emit('passParamToParent', this.heightStatus)
        },
        confirm() {
            this.changeSettingsStatus({'split': this.curSplitStatus, 'management': this.curManagementStatus})
            this.changeHeightStatus()
            this.changeSession()
            this.$refs.settingModal.hide()
        },
        resetSession() {
            this.curSplitStatus = this.tokenSplitStatus
            this.curManagementStatus = this.tokenManagementStatus
            this.heightStatus = this.getHeightStatus()
            this.selectedSession = this.getSelectedSession()
        }
    }
}
</script>

<style scoped>
.setting-input {
    height: 48px !important;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.div-set {
    padding-top: 24px;
    margin-bottom: 40px;
    margin-left: 15px;
    margin-right: 15px;
}
.div-t {
    text-align: left;
    margin-bottom: 30px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.btn-back {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.btn-bottom {
    margin-left: 0px;
    margin-right: 0px;
}
.label-st {
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
}
.show-height {
    z-index: 100;
    cursor:pointer;
    background-color: #FFF;
}
.enable-function {
    z-index: 100;
    cursor:pointer;
    background-color: #FFF;
}
</style>
