<template>
  <div>
    <h3>Welcome</h3>
  </div>
</template>

<script>
import hub from '../utils/hub.js'
export default {
  name: '',

  data () {
    return {
    }
  },
  created() {
    hub.$emit('saveNavActive', '')
  },

  methods: {}
}
</script>

<style lang='less' scoped>

</style>
