<template>
  <div class="title-des">
    <H2 class="fsize-title">
      {{ title }}
    </H2>
    <div class="des">
      <span
        v-html="description">
      </span>
      <b-button
        class="btn-goback"
        @click="$emit('goback')"
        v-if="gobackAct"
        variant="link">
        go back
      </b-button>
    </div>
    <hr>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'VTitle',
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: '',
            required: false
        },
        gobackAct: {
            type: Boolean,
            default: false,
            required: false
        }
    }
}
</script>
<style scoped>
.title-des {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.des {
    color: #9091A3;
    padding: 0px 46px;
}
.btn-goback {
    padding-left: 0px;
}
.fsize-title {
    font-size: 34px;
}
</style>
