<template>
  <div
    :class="classes">
    <div class="card-body card-asset text-left">
      <div class="card-text mb-2">
        <p class="mb-0 show-number addr"><b>{{ addrShow }}</b></p>
        <p class="mb-0 asset-title">Wallet Address</p>
      </div>
      <div class="card-text">
        <p class="mb-0 show-number balance"><b>{{ balance }} VEE</b></p>
        <p class="mb-0 asset-title">Balance</p>
      </div>
    </div>
  </div>
</template>

<script>
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
        balance: {
            type: Number,
            default: 0,
            required: true
        },
        selected: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    computed: {
        addrShow() {
            const addrChars = this.address.split('')
            addrChars.splice(6, 23, '******')
            return addrChars.join('')
        },
        classes() {
            if (!this.selected) {
                return ['card', 'asset', 'shadow-sm']
            }
            return ['card', 'asset', 'shadow', 'selected-asset']
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
.selected-asset {
    background-color: @veeColor;
    color: white;
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
.addr {
    color: #181B3A;
}
.selected-asset .addr {
    color: white;
}
.balance {
    color: #696B8A;
}
.selected-asset .balance {
    color: white;
}
.asset:not(.selected-asset):hover {
    background-color: #FAFAFA;
}
</style>
