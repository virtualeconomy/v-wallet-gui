<template>
  <b-modal :id="'tokenInfoModal_' + tokenId"
           ref="tokenInfoModal"
           class="tx-modal"
           lazy
           centered
           hide-header
           hide-footer>
    <div class="md-content">
      <button
        class="close btn-close"
        @click="closeModal">
        <img src="@/assets/imgs/icons/operate/ic_close.svg">
      </button>
      <div class="tx-title">
        <div class="tx-icon">
          <img src="@/assets/imgs/icons/operate/ic_token2.svg"
               width="60px"
               height="60px">
        </div>
        <div class="received-amount">TokenInfo</div>
      </div>
      <div class="tx-address">
        <label>TokenId</label>
        <span>{{ tokenId }}</span>
      </div>
      <div class="tx-address">
        <label>Contract ID</label>
        <span>{{ contractId }}</span>
      </div>
      <div class="tx-block">
        <label>Maker</label>
        <span>{{ maker }}</span>
      </div>
      <div class="tx-block">
        <label>Issuer</label>
        <span>{{ issuer }}</span>
      </div>
      <div class="tx-attachment">
        <label>Max Supply</label>
        <span>{{ formatter(maxSupply) }}</span>
      </div>
      <div class="tx-attachment">
        <label>Current Supply</label>
        <span>{{ currentSupply }}</span>
      </div>
      <div class="tx-attachment">
        <label>Unity</label>
        <span>{{ formatter(unity) }}</span>
      </div>
      <div class="tx-attachment">
        <label>Token Description</label>
        <span>{{ tokenDescription }}</span>
      </div>
    </div>
  </b-modal>
</template>

<script>
import BigNumber from 'bignumber.js'
import browser from '@/utils/browser'
export default {
    name: 'TokenInfoModal',
    props: {
        tokenId: {
            type: String,
            default: '',
            require: true
        },
        contractId: {
            type: String,
            default: '',
            require: true
        },
        maxSupply: {
            type: BigNumber,
            default: '',
            require: true
        },
        currentSupply: {
            type: String,
            default: '',
            require: true
        },
        tokenDescription: {
            type: String,
            default: '',
            require: true
        },
        unity: {
            type: BigNumber,
            default: '',
            require: true
        },
        issuer: {
            type: String,
            default: '',
            require: true
        },
        maker: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        txClass() {
            return this.txIcon.replace(/\s+/g, '')
        }
    },
    methods: {
        closeModal() {
            this.$refs.tokenInfoModal.hide()
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped lang="less">
.tx-modal {
    text-align: center;
    .tx-title {
        padding: 24px 0;
        border-bottom: 1px solid #1111;
        .tx-icon {
            margin-bottom: 10px;
        }
    }
    .tx-address {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .tx-id {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .tx-block {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .tx-fee {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .tx-attachment {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
          font-size: 15px;
          color: #9091A3;
          letter-spacing: 0;
        }
    }
    .sent-amount {
        font-size: 28px;
        color: #F5354B;
        letter-spacing: 0;
        text-align: center;
    }
    .received-amount {
        font-size: 28px;
        color: #23A28C;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedin-amount {
        font-size: 28px;
        color: #86BEF7;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedout-amount {
        font-size: 28px;
        color: #73CC5A;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedoutcanceled-amount {
        font-size: 28px;
        color: #FF7A8A;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedincanceled-amount {
        font-size: 28px;
        color: #FFD192;
        letter-spacing: 0;
        text-align: center;
    }
    .md-content {
        padding: 40px 24px;
        padding-top: 0;
    }
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
</style>
