<template>
  <b-modal :id="'renameSymbol_'+tokenId"
           ref="renameModal"
           lazy
           centered
           hide-header
           hide-footer>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="content">
      <div class="form-group cus-group">
        <label style="font-weight:500;width:100%">Rename Symbol</label>
        <b-form-input class="form-control input-bottom"
                      v-model="name"
                      :state="checkSymbol(name)"
                      aria-describedby="inputSymbolLiveFeedback"
                      placeholder="Please input Token Symbol"
                      onfocus="this.select()"></b-form-input>
        <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                 style="margin-left: 100px;"
                                 v-if="!isValidSymbol(name)">
          Symbol must be digits or English letters within 10.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                 style="margin-left: 100px;"
                                 v-if="!isUsedSymbol(name)">
          Symbol already exists.
        </b-form-invalid-feedback>
      </div>
      <b-row class="button-row">
        <b-col class="col-lef">
          <b-button
            class="btn-cancel"
            block
            variant="light"
            size="lg"
            @click="closeModal">Cancel
          </b-button>
        </b-col>
        <b-col class="col-rig">
          <b-button
            block
            class="btn-confirm"
            variant="warning"
            size="lg"
            :disabled="isSubmitDisabled"
            @click="updateName">Rename
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'RenameSymbolModal',
    props: {
        tokenId: {
            type: String,
            default: ''
        },
        tokenRecords: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    data: function() {
        return {
            name: ''
        }
    },
    computed: {
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        isSubmitDisabled() {
            return !this.checkSymbol(this.name)
        }
    },
    methods: {
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.seedAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        updateName() {
            let tmp = this.tokenRecords
            tmp[this.tokenId].name = this.name
            this.setUsrLocalStorage('tokens', JSON.stringify(tmp))
            this.$emit('refreshTokens', 'refresh')
            this.closeModal()
        },
        checkSymbol(name) {
            return this.isUsedSymbol(name) && this.isValidSymbol(name)
        },
        isUsedSymbol(name) {
            if (name === 'VSYS') {
                return false
            }
            let tmp = this.tokenRecords
            for (let tokenId in tmp) {
                if (tmp[tokenId].name === name) {
                    return false
                }
            }
            return true
        },
        isValidSymbol(name) {
            if (!name) {
                return void 0
            }
            let Regx = /^[A-Za-z0-9]*$/
            return name.length <= 10 && Regx.test(name)
        },
        closeModal() {
            this.name = ''
            this.$refs.renameModal.hide()
        }
    }
}
</script>

<style scoped lang="less">
.contnet{
    margin-top: 20px;
}
.form-group{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.cus-group label {
    margin-left: 4px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.cus-group input {
    width: 80%;
    height:48px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    margin: 24px;
    margin-bottom: 10px!important;
}
</style>
