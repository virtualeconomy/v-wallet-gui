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
        const url = NODE_IP + '/blocks/height'
        this.$http.get(url).then(response => {
            this.$router.push('/login')
        }, response => {
            this.$router.push('/warning')
        })
    }
}
</script>

<style scoped>
.warning{
    width: 100%;
    height: 100%;
    background-color: #fafafa;
}
.container logo {
    margin-left: 0%;
}
.note {
    width: 65%;
    height: 60%;
    left: 30%;
    margin-left: 35%;
    margin-top:100px;
    margin-bottom: 0px;
    background-color: #FFFFFF;
}
.image {
    position: absolute;
    width: 45%;
    height: 70%;
    margin-left: 27%;
    margin-top: 35px;
    background-color: #FFFFFF;
}

.reason {
    color: #4F515E;
    font-size: 20px;
    margin-top: 20px;
    margin-left: -30px;
}
.title {
    color: #181B3A;
    font-size: 40px;
    margin-top: -150px;
    margin-left:-50px;
}
.content {
    color: #4F515E;
    text-align: left;
    font-size: 20px;
    margin-top: 10px;
    margin-left: 160px;

}
.brand-logo {
    top: 20px;
    margin-top: 16px;
    margin-left: -70px;
    height: 28px;
}
</style>
