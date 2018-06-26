<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="1">
        <img src="../../../assets/imgs/logo-small.png"
             width="20px"
             height="20px">
      </b-col>
      <b-col class="record-detail"
             cols="3">
        <b-row>
          <b-col class="title">Sent VEE</b-col>
        </b-row>
        <b-row>
          <b-col class="detail">To: {{ transactionAddress }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-time"
             cols="2">
        <b-row>
          <b-col>&nbsp;&nbsp;&nbsp;&nbsp;</b-col>
        </b-row>
        <b-row>
          <b-col class="record-time">| {{ transactionTime }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"
             cols="3"
             md="3"></b-col>
      <b-col class="record-amount"
             cols="2">
        <div>
          <span>{{ transactionAmount }} VEE</span>
        </div>
      </b-col>
      <b-col class="record-action"
             cols="1">
        <b-dropdown no-caret
                    class="more-btn"
                    right>
          <template slot="actions">
            <img src="../../../assets/imgs/icons/ic_more.svg"><span class="sr-only"></span>
          </template>
          <b-dropdown-item>TX info</b-dropdown-item>
          <b-dropdown-item>Copy TX ID</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
    name: 'Record',
    props: {
        transactionAddress: {
            type: String,
            default: ''
        },
        transactionTime: {
            type: String,
            default: ''
        },
        transactionAmount: {
            type: String,
            default: '0'
        }
    }
}
</script>

<style scoped lang="less">
.record-unit {
    font-size: 16px;
    text-align: left;
    vertical-align: middle;
    text-overflow: ellipsis;
    border: 1px solid #EDEDF0;

    .record-icon {
        width: 10%;
    }
    .record-detail {
        .title {
            font-size: 16px;
            font-weight: bold;
        }
        .detail {
            font-size: 10px;
            text-overflow: ellipsis;
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
        }
    }
    .record-time {
        font-size: 10px;
        padding-top: 6px;
    }
    .record-amount {
        padding-top: 4px;
    }
    .record-action {
        .more-btn {
            button {
                background: none;
                border: none;
            }
        }
    }
}

</style>
