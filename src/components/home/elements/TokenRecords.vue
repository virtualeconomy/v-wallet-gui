<template>
  <div v-if="Object.keys(tokenRecords).length > 0"
       class="records">
    <div class="title-records">
      <span>Token Watch List</span>
    </div>
    <div class="inherit-height">
      <div class="scroll"
           :style="{height: myHeight}">
        <TokenRecord v-for="(index,tokenId) in tokenRecords"
                     :key="tokenId"
                     :token-id="tokenId"
                     :address="address"
                     :addresses="addresses"
                     :cold-addresses="coldAddresses"
                     :wallet-type="walletType"></TokenRecord>
      </div>
    </div>
  </div>
  <div v-else
       class="records">
    <div class="title-records">
      <span>Token Watch List</span>
    </div>
    <div class="empty">
      There are no token in watch list.
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import browser from '../../../utils/browser'
import TokenRecord from './TokenRecord'
import AddToken from '../modals/AddToken'
import bus from '../../../assets/bus'
// import BigNumber from 'bignumber.js'
export default {
    name: 'TokenRecords',
    components: {
        TokenRecord,
        AddToken
    },
    created() {
        this.myHeight = (this.isMobile() ? window.innerHeight + 100 : window.innerHeight - 300) + 'px'
        if (this.address && Vue.ls.get('pwd')) {
            this.gettokenRecords()
        }
    },
    data() {
        return {
            tokenRecords: {},
            showingNum: 10,
            changeShowDisable: false,
            myHeight: '0'
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        },
        addresses: {
            type: Object,
            default: function() {},
            require: true
        },
        walletType: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        seedaddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.seedaddress))
        }
    },
    mounted() {
        bus.$on('sendFlag', (data) => {
            setTimeout(() => { this.gettokenRecords() }, 3000)
        })
    },
    methods: {
        isMobile() {
            return browser.isMobile()
        },
        gettokenRecords() {
            if (this.address) {
                this.changeShowDisable = true
                let records = JSON.parse(window.localStorage.getItem(this.seedaddress))
                if (records.tokens) {
                    this.tokenRecords = JSON.parse(records.tokens)
                }
                this.changeShowDisable = false
            }
        }
    }
}
</script>

<style scoped lang="less">
.empty {
    padding: 24px 0;
    background-color: #1111;
}
.records {
    background: #FFFFFF;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    margin: 0px 0px;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
}
.monthTtl {
    height: 44px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid #EDEDF0;
    background: #FFF;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
    padding: 14px 21px;
}
.inherit-height {
    position: relative;
    height: inherit;
    padding-top: 52px;
    top: -52px;
}
.title-records {
    background: #FAFAFA;
    padding: 8px 20px;
    border-bottom: 1px solid #EDEDF0;
    height: 52px;
    text-align: left;
    font-size: 17px;
    color: #010102;
    letter-spacing: 0;
    display: flex;
    align-items: Center;
}
.btn-export {
    width: 116px;
    height: 36px;
    background-color: #FFF;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
    justify-content:center;
    img {
        margin-right: 8px;
    }
}
.pd-select {
    position: absolute;
    right: 40px;
    display: flex;
    height: 36px;
    z-index: 100;
    background-color: #FFF;
}
.pd-select:hover, .pd-select:active {
    background-color: #FAFAFA !important;
}
.selection {
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
}
.show-position {
    position: absolute;
    left: 13px;
}
.show-fee {
    position: absolute;
    right:240px;
    width: 116px;
    height: 36px;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
    justify-content:center;
}
.show-fee2 {
    position: absolute;
    right:7px;
    width: 15px;
    height: 30px;
    display: flex;
    z-index: 100;
    cursor:pointer;
    background-color: #FFF;
}
</style>
