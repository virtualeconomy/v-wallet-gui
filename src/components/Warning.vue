<template>
  <div class="warning">
    <div class="container logo">
      <img
        class="brand-logo"
        src="../assets/imgs/icons/signup/vsys_logo.svg">
    </div>
    <div class="image">
      <div class="note"
           :style="note">
      </div>
      <div class="title">
        Warning
      </div>
      <div class="reason">
        This may be caused by following reasons:
      </div>
      <div class="content">
        <ul>
          <li>Network is disconnected</li>
          <li>Can not connect to the api server</li>
          <li>Local javascript is crushed</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {NODE_IP} from '../constants'
export default {
    name: 'Warning',
    data() {
        return {
            note: {
                backgroundImage: 'url(' + require('../assets/imgs/icons/operate/img_warning.svg') + ')',
                backgroundRepeat: 'no-repeat'
            }
        }
    },
    created() {
        const url = NODE_IP + '/blocks/last'
        this.$http.get(url).then(response => {
            if (response.body.height) {
                this.$router.push('/login')
            }
        }, respError => {
            this.$router.push('/warning')
        })
    }
}
</script>

<style scoped>
.warning{
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
}
.note {
    width: 550px;
    height: 512px;
    left: 30%;
    margin-left: 35%;
    margin-top:100px;
    margin-bottom: 0px;
    background-color: #FFFFFF;
}
.image {
    width: 550px;
    height: 512px;
    margin-left: 27%;
    margin-top: 35px;
    background-color: #FFFFFF;
}

.reason {
    color: #4F515E;
    font-size: 20px;
    margin-top: 20px;
    margin-left: 120px;
}
.title {
    color: #181B3A;
    font-size: 40px;
    margin-top: -320px;
    margin-left:170px;
    width: 45%;
    background-color: #FFFFFF;
}
.content {
    color: #4F515E;
    text-align: left;
    font-size: 20px;
    margin-top: 10px;
    margin-left: 135px;
    width: 70%;
    background-color: #FFFFFF;

}
.brand-logo {
    top: 20px;
    margin-top: 16px;
    margin-left: -70px;
    height: 28px;
}
.txt {
    margin-top: 35px;
    position: absolute;
}
</style>
