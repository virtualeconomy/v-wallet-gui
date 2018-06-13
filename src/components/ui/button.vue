<template>
  <button type="button"
          class="v-btn"
          :class="[computedType, computedSize, computedOutline, computedActive, computedBlock]">
    {{ btnText }}
  </button>
</template>

<script>
export default {
    name: 'VButton',
    props: {
        btnText: {
            type: String,
            default: 'button'
        }, // 按钮文本内容
        btnType: {
            type: String,
            default: 'primary'
        }, // 按钮类型
        btnSize: {
            type: Number,
            default: 36
        }, // 按钮尺寸大小
        btnOutline: {
            type: String,
            required: false,
            default: '1px solid #FFF'
        }, // 只有边框的按钮样式
        btnActive: {
            type: Boolean,
            default: false
        }, // 按钮状态，是一个布尔值，true表示激活（当前状态）
        btnBlock: {
            type: Boolean,
            default: true
        } // 按钮是不是块元素，是一个bool值，true表示块元素
    },
    computed: {
        computedType: function() {
            return this.btnType ? `btn-${this.btnType}` : ''
        },
        computedSize: function() {
            return this.btnSize ? `btn-${this.btnSize}` : ''
        },
        computedOutline: function() {
            return this.btnOutline ? `btn-outline-${this.btnOutline}` : ''
        },
        computedActive: function() {
            return this.btnActive === true ? 'active' : ''
        },
        computedBlock: function() {
            return this.btnBlock === true ? 'btn-block' : ''
        }
    }
}
</script>

<style scoped>
    @import '../../assets/style/common.less';
    @import '../../assets/style/variables.less';

</style>
