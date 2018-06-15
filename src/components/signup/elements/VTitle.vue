<template>
  <div>
    <H1>
      {{ title }}
    </H1>
    <span v-html="description"></span>
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

</style>
