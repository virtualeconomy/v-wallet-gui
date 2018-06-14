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
        // titleData: {
        //     type: {
        //         title: {
        //             type: String,
        //             default: ''
        //         },
        //         description: {
        //             type: String,
        //             default: '',
        //             required: false
        //         }
        //     },
        //     default: {
        //         title: '',
        //         description: ''
        //     }
        // }
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: '',
            required: false
        }
        //     {
        //     title: {
        //         type: String,
        //         default: ''
        //     },
        //     description: {
        //         type: String,
        //         default: '',
        //         required: false
        //     }
        // }
    }
}
</script>
<style scoped>

</style>
