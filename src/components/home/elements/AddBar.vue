<template>
<div>
    <b-bar
        class="nav-item"
        variant="faded"
        toggleable>
    </b-bar>
</div>

</template>

<script>

    import Settings from '../modals/Settings'
    import Account from '../modals/Account'
    import About from '../modals/About'
    import {NETWORK_BYTE, NODE_IP} from '../../../constants.js'
    import Vue from 'vue'
    import jdenticon from '@/libs/jdenticon-2.1.0'

    export default {
        name: 'NavBar',
        components: {
            Settings,
            Account,
            About
        },
        props: {
            username: {
                type: String,
                require: true,
                default: ''
            },
            addresses: {
                type: Object,
                require: true,
                default: function() {}
            },
            address: {
                type: String,
                require: true,
                default: ''
            },
            avtHash: {
                type: String,
                require: true,
                default: ''
            },
            coldAddresses: {
                type: Object,
                require: true,
                default: function() {}
            },
            getPubKey: {
                type: Function,
                require: true,
                default: function() {
                    return ''
                }
            },
            getPriKey: {
                type: Function,
                require: true,
                default: function() {
                    return ''
                }
            },
            getSeedPhrase: {
                type: Function,
                require: true,
                default: function() {
                    return ''
                }
            },
            setUsrLocalStorage: {
                type: Function,
                require: true,
                default: function() {
                    return ''
                }
            }
        },
        data() {
            return {
                networkType: '',
                interval: 0,
                response: '',
                currentTime: '',
                showHeight: false,
                currentHeight: 0
            }
        },
        created() {
            this.networkType = String.fromCharCode(NETWORK_BYTE)
            this.showHeight = this.getHeightStatus()
            if (this.showHeight) {
                this.childByValue(this.showHeight)
            }
            this.getBlockHeight()
        },
        mounted() {
            jdenticon()
        },
        computed: {
        },
        beforeDestroy() {
            if (this.interval) {
                clearInterval(this.interval)
                this.interval = 0
            }
        },
        methods: {
            getBlockHeight() {
                const url = NODE_IP + '/blocks/last'
                this.$http.get(url).then(response => {
                    this.response = response.body
                    let tempTime = new Date(this.response.timestamp / 1e6).toLocaleString()
                    window.localStorage.setItem('globalHeight', this.response.height)
                    window.localStorage.setItem('time', tempTime)
                    this.currentHeight = this.response.height
                    this.currentTime = tempTime
                }, response => {
                })
            },
            getHeightStatus() {
                let oldHeightStatus = false
                try {
                    oldHeightStatus = JSON.parse(window.localStorage.getItem('heightStatus'))
                } catch (e) {
                }
                return oldHeightStatus
            },
            childByValue: function(heightStatus) {
                this.showHeight = heightStatus
                if (this.showHeight) {
                    if (this.interval) {
                        clearInterval(this.interval)
                    }
                    this.interval = setInterval(() => {
                        setTimeout(this.getBlockHeight, 0)
                    }, 16000)
                } else {
                    if (this.interval) {
                        clearInterval(this.interval)
                        this.interval = 0
                    }
                }
            },
            logout() {
                Vue.ls.clear()
                this.$router.push('/login')
            },
            deleteCold(addr) {
                this.$emit('delete-cold', addr)
            }
        }
    }
</script>

<style scoped>
    .avatar {
        border-width: 2px;
        border-style: solid;
        border-color: rgb(180, 180, 180);
        border-radius: 5px;
        padding: 0px;
        height: 32px;
        width: 32px;
    }
    .username {
        display: inline-block;
    }
    .brand-logo {
        height: 24px;
    }
    .nav-item {
        background-color: rgb(240, 240, 240);
    }
    .block {
        position: relative;
        display: inline-block;
        margin-top:15px;
        margin-right: 10px;
        height:19px;
        color: rgba(0, 0, 0, 0.5);
    }
    .block .time-height{
        height:19px;
        top: 15px;
        color: rgba(0, 0, 0, 0.5);
        z-index: 12;
        visibility: hidden;
    }
    .block:hover .time-height {
        visibility: visible;
    }
</style>
