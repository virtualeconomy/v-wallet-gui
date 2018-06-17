<template>
  <div class="title-des">
    <H1>
      {{ title }}
    </H1>
    <span v-html="description"></span>
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
        }
    }
}
</script>
<style scoped>
.title-des {
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
</style>
