<template>
  <div
    :class="classes">
    <div class="card-body card-asset text-left">
      <div class="card-text mb-2">
        <p class="mb-0 show-number addr"><b>{{ addressShow }}</b></p>
        <p class="mb-0 asset-title">#{{ index + 1 }} Wallet Address</p>
      </div>
      <div class="card-text">
        <img src="@/assets/imgs/icons/wallet/Symbol_Yellow.svg"
             class="money-icon unselected-icon"
             width="16"
             height="16">
        <img src="@/assets/imgs/icons/wallet/Symbol_White.svg"
             class="money-icon selected-icon"
             width="16"
             height="16">
        <p class="mb-0 show-number balance"><b>{{ selected? formatter(available): formatter(balance) }}</b></p>
        <p class="mb-0 asset-title">Balance</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'Asset',
    props: {
        title: {
            type: String,
            default: 'Asset'
        },
        address: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        balance: {
            type: BigNumber,
            default: function() {
                return BigNumber(NaN)
            },
            required: true
        },
        selected: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    data() {
        return {
            addressShow: ''
        }
    },
    created() {
        this.addrShow()
    },
    watch: {
        getAssetStatus: {
            handler(newValue, oldValue) {
                this.addrShow()
            }
        }
    },
    computed: {
        ...mapState({
            available: 'available',
            assetStatus: 'assetStatus'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        getAssetStatus() {
            return this.assetStatus
        },
        classes() {
            if (!this.selected) {
                return ['card', 'asset', 'shadow-sm']
            }
            return ['card', 'asset', 'shadow', 'selected-asset']
        }
    },
    methods: {
        ...mapActions(['updateAssetStatus']),
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        addrShow() {
            let alias = null
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
            }
            const addrChars = this.address.split('')
            addrChars.splice(6, 23, '******')
            this.addressShow = alias && alias[this.address] != null ? alias[this.address] + ' (' + addrChars.join('') + ')' : addrChars.join('')
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';

.asset {
    margin-bottom: 15px;
}
.no-left-padding {
    padding-left: 0px;
}

@-webkit-keyframes assetFadeIn {
    from {
        background-color: white;
    }

    to {
        background-color: @vsysColor;
    }
}
@keyframes assetFadeIn {
    from {
        background-color: white;
    }

    to {
        background-color: @vsysColor;
    }
}
.selected-asset {
    color: white;
    -webkit-animation-name: assetFadeIn;
    animation-name: assetFadeIn;
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.asset-title {
    font-size: 13px;
    color: #9091A3;
}
.selected-asset .asset-title {
    color: #FFCEAD;
}
.card-asset {
    padding: 16px 20px;
}
.show-number {
    font-size: 15px;
}
.money-icon {
    display: inline-block;
}
.addr {
    color: #181B3A;
}
.selected-asset .addr {
    color: white;
}
.balance {
    color: #696B8A;
    display: inline-block;
}
.selected-asset .balance {
    color: white;
}
.asset:not(.selected-asset):hover {
    background-color: #FAFAFA;
}

.shadow-sm .selected-icon {
    display: none;
}
.shadow .unselected-icon {
    display: none;
}
</style>
