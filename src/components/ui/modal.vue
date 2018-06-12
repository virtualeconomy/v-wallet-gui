<template>
	<div class="v-modal-mask" v-show="show" transition="modal">
		<div class="v-modal-wrapper" v-show="show" transition="modal">
			<div class="v-modal-container">
				<div class="v-modal-header">
					<slot name="header">
						<p class="v-modal-title">{{ modal.title }}</p>
					</slot>
					<span class="v-modal-close"></span>
				</div>
				<div class="v-modal-body">
					<p class="v-modal-text">{{ modal.text }}</p>
				</div>
				<div class="v-modal-footer">
					<slot name="button">
						<v-button btn-text="Primary" btn-type="primary"></v-button>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VButton from './button'
export default {
	name: 'v-modal',
	components: {VButton},
	data () {
		return {
			show: false,
			resolve: '',
			reject: '',
			promise: ''
		}
	},
	methods: {
		// 确定，将promise断定为完成态
		submit () {
			this.resolve('submit')
		},
		// 关闭，将promise断定为reject态
		close (type) {
			this.show = false
			this.reject(type)
		},
		// 显示confirm弹出，并创建promise对象
		confirm () {
			this.show = true
			this.promise = new Promise((resolve, reject) => {
				this.resolve = resolve
				this.reject = reject
			})
			return this.promise
		}
	}
}
</script>

<style scoped>
	.v-modal-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		display: block;
		transition: opacity .3s ease;
	}
	.v-modal-wrapper {
		display: block;
		position: absolute;
		vertical-align: middle;
		width: 400px;
		height: 600px;
		margin: auto auto;
	}

	.v-modal-container {
		width: 360px;
		height: 540px;
		margin: auto auto;
		background-color: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
		transition: all .3s ease;
	}

	.v-modal-header h3 {
		margin-top: 0;
		color: #42b983;
	}

	.v-modal-body {
		margin: 20px 0;
	}
</style>
