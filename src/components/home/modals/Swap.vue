<template>
  <b-modal id="swapModal"
           title="Swap"
           class="swap"
           ref="swapModal"
           centered
           hide-header
           hide-footer
           ok-only>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs class="tabs"
            justified
            no-fade
            @input="switchTab">
      <b-tab>
        <div class="tab_title"
             slot="title">Swap</div>
        <div class="swap">
          <div class="swap_ipt">
            <div class="swap_ipt_content">
              <span>From</span>
              <span>Balance: 0.022444</span>
            </div>
            <div class="swap_ipt_content">
              <input type="number"
                     class="count"
                     placeholder="0.0"
                     v-model="from_count">
              <b-dropdown size="lg"
                          variant="blank"
                          no-caret>
                <template slot='button-content'>
                  <div class="dropdown_text">
                    <img class="detail_content_img"
                         src="@/assets/imgs/icons/wallet/eth.png">
                    <span class="coin_type">ETH</span>
                    <img class="arrow"
                         src="@/assets/imgs/icons/wallet/low.png">
                  </div>
                </template>
                <b-dropdown-item href="#">
                  <div class="dropdown_text">
                    <img class="detail_content_img"
                         src="@/assets/imgs/icons/wallet/eth.png">
                    <span class="coin_type">ETH</span>
                </div></b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="direction">
            <img src="@/assets/imgs/icons/wallet/arrow_down.png"
                 class="direction_arrow">
          </div>
          <div class="swap_ipt">
            <div class="swap_ipt_content">
              <span>To</span>
              <span>Balance: 0.022444</span>
            </div>
            <div class="swap_ipt_content">
              <input type="number"
                     class="count"
                     placeholder="0.0"
                     v-model="to_count">
              <b-dropdown size="lg"
                          variant="blank"
                          no-caret>
                <template slot='button-content'>
                  <div class="dropdown_text">
                    <img class="detail_content_img"
                         src="@/assets/imgs/icons/wallet/usd.png">
                    <span class="coin_type">USD</span>
                    <img class="arrow"
                         src="@/assets/imgs/icons/wallet/low.png">
                  </div>
                </template>
                <b-dropdown-item href="#">
                  <div class="dropdown_text">
                    <img class="detail_content_img"
                         src="@/assets/imgs/icons/wallet/usd.png">
                    <span class="coin_type">USD</span>
                </div></b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="price">
            <span>Price</span>
            <div class="price_content">
              <span>0.00420202</span>
              <span style="margin-left:10px;margin-right:10px">ETH per USDT</span>
              <img src="@/assets/imgs/icons/wallet/switch.png"
                   class="switch">
            </div>
          </div>
          <div class="swap_btn">
            <b-button class="btn-swap"
                      block
                      variant="light"
                      size="lg">Swap</b-button>
          </div>
          <div class="min">
            <div class="min_title">
              <span>Minimum received</span>
              <img src="@/assets/imgs/icons/wallet/help.png"
                   class="help_min">
            </div>
            <span>13.38 USDT</span>
          </div>
          <div class="min"
               style="margin-top:10px">
            <div class="min_title">
              <span>Price Impact</span>
              <img src="@/assets/imgs/icons/wallet/help.png"
                   class="help_min">
            </div>
            <span>0.02 %</span>
          </div>
        </div>
      </b-tab>
      <b-tab class="b_tab">
        <div class="tab_title"
             slot="title">Pool</div>
        <b-row style="width:100%">
          <b-col class="col-lef">
            <b-button class="btn-create"
                      block
                      variant="light"
                      size="lg">Create a pair</b-button>
          </b-col>
          <b-col class="col-lef">
            <b-button class="btn-add"
                      block
                      variant="light"
                      size="lg">Add Liquidty</b-button>
          </b-col>
        </b-row>
        <div class="liquidty">
          <div class="liquidty_title">Your Liquidty</div>
          <img src="@/assets/imgs/icons/wallet/help.png"
               class="help">
        </div>
        <div :class="{card:true,card_active:isShowDetail}">
          <div class="card_select">
            <div class="card_select_type">
              <img src="@/assets/imgs/icons/wallet/d_e.png"
                   class="card_select_type_img">
              <span class="card_select_type_text">USDC/ETH</span>
            </div>
            <div @click="showDetail">
              <img class="arrow"
                   :src="require(isShowDetailData ? '@/assets/imgs/icons/wallet/up.png' :'@/assets/imgs/icons/wallet/low.png')">
            </div>
          </div>
          <div class="showDetail"
               v-show="isShowDetailData">
            <div class="detail">
              <div class="detail_title">Pooled USDC:</div>
              <div class="detail_content">
                <span>22.9999</span>
                <img class="detail_content_img"
                     src="@/assets/imgs/icons/wallet/usd.png">
              </div>
            </div>
            <div class="detail">
              <div class="detail_title">Pooled ETH:</div>
              <div class="detail_content">
                <span>0.0988721</span>
                <img class="detail_content_img"
                     src="@/assets/imgs/icons/wallet/eth.png"></div>
            </div>
            <div class="detail">
              <div class="detail_title">Your pool  tokens:</div>
              <div class="detail_content">0.0000001379</div>
            </div>
            <div class="detail">
              <div class="detail_title">Your pool  share:</div>
              <div class="detail_content">0.0%</div>
            </div>
            <div class="view">
              <span>View pool information</span>
              <img src="@/assets/imgs/icons/wallet/share.png"
                   class="share">
            </div>
            <b-row style="width:100%;margin-top:19px">
              <b-col class="col-lef">
                <b-button class="btn-detail"
                          block
                          variant="light"
                          size="lg">Add</b-button>
              </b-col>
              <b-col class="col-lef">
                <b-button class="btn-detail"
                          block
                          variant="light"
                          size="lg">Remove</b-button>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="import">
          <span>Don’t see a pool you joined？</span>
          <span style="color:#FF8637;cursor: pointer;">Import it.</span>
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// import Vue from 'vue'
// import { INITIAL_SESSION_TIMEOUT } from '@/constants'
// import { mapState, mapActions } from 'vuex'
export default {
    name: 'Swap',
    components: {
    },
    created() {
    },
    props: {
    },
    data() {
        return {
            isShowDetail: false,
            isShowDetailData: false,
            from_count: '',
            to_count: ''

        }
    },
    computed: {
    },
    methods: {
        closeModal() {
            this.$refs.swapModal.hide()
        },
        switchTab() {
            this.isShowDetail = false
            this.isShowDetailData = false
        },
        showDetail() {
            this.isShowDetail = !this.isShowDetail
            setTimeout(() => {
                this.isShowDetailData = !this.isShowDetailData
            }, !this.isShowDetailData ? 300 : 200)
        }
    }
}
</script>

<style scoped>
.b_tab{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.switch{
    width: 20px;
    height: 20px;
}
.dropdown_text{
    display: flex;
    align-items: center;
}
.coin_type{
    margin-left:10px;
    margin-right:10px
}
.swap{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.swap_ipt{
    width: 100%;
    height: 100px;
    border: 1px solid #D1D1D1;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 12px;
}
.swap_ipt_content{
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4A4A4A;
    font-size: 14px;
}
.count{
    font-size: 20px;
    border:none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
	-webkit-appearance: none !important;
	margin: 0;
}
input::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 20px;
}
.direction{
    width: 90%;
    margin: 15px;
}
.direction_arrow{
    width: 13px;
    height: 14px;
}
.price{
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    color: #4A4A4A
}
.price_content{
    font-size: 14px;
}
.min{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
}
.help_min{
    width: 14px;
    height: 14px;
    margin-left: 5px;
}
.swap_btn{
    width: 95%;
    margin-top: 20px;
}
.btn-swap {
  border-radius: 24px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-family: SFProText-Medium, SFProText;
  font-weight: 500;
  color: rgba(255, 255, 255, 1) !important;
  line-height: 19px;
  background: rgba(255, 134, 55, 100);
  border: 1px solid #FF8637 !important;
}
.btn-swap:hover{
  background: rgba(255, 134, 55, 100) !important;
}
.btn-create {
  width: 160px;
  height: 44px;
  background: rgba(255, 255, 255, 1);
  border-radius: 20px;
  border: 1px solid rgba(242, 242, 247, 1);
  font-size: 18px;
  font-family: SFProText-Regular, SFProText;
  font-weight: 400;
  color: rgba(255, 134, 55, 100) !important;
  line-height: 19px;
  border: 1px solid #FF8637 !important;
}
.btn-add {
  border-radius: 20px;
  width: 160px;
  height: 44px;
  font-size: 18px;
  font-family: SFProText-Medium, SFProText;
  font-weight: 500;
  color: rgba(255, 255, 255, 1) !important;
  line-height: 19px;
  background: rgba(255, 134, 55, 100);
  border: 1px solid #FF8637 !important;
}
.btn-add:hover{
  background: rgba(255, 134, 55, 100) !important;
}
.liquidty{
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
}
.liquidty_title{
    font-weight: bold;
    color: #000000;
}
.help{
    width: 14px;
    height: 14px;
}
.card{
    width: 95%;
    height: 50px;
    border: 1px solid #D1D1D1;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    transition-property:  height;
    transition-duration:0.3s;
    transition-delay:0.1s;
    transition-timing-function: ease-in-out;
}
.card_active{
    height: 310px;
}
.card_select{
    width: 90%;
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.card_select_type{
    display: flex;
    align-items: center;
}
.card_select_type_img{
    width: 34px;
    height: 21px;
}
.arrow{
    width: 15px;
    height: 9px;
    cursor: pointer;
}
.card_select_type_text{
    font-weight: bold;
    margin-left: 8px;
}
.showDetail{
    width: 90%;
    margin-top: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.detail{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
}
.detail_content_img{
    width: 20px;
    height: 20px;
    margin-left: 3px;
}
.view{
    color: #FF8431;
    font-size: 14px;
    margin-top: 21px;
    cursor: pointer;
}
.share{
    width: 6px;
    height: 6px;
}
.btn-detail{
    border-radius: 16px;
    width: 110px;
    height: 34px;
    font-size: 13px;
    font-family: SFProText-Medium, SFProText;
    font-weight: 500;
    color: rgba(255, 255, 255, 1) !important;
    line-height: 19px;
    background: rgba(255, 134, 55, 100);
    border: 1px solid #FF8637 !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn-detail:hover{
  background: rgba(255, 134, 55, 100) !important;
}
.import{
    margin-top: 30px;
    font-size: 14px;
}
</style>
