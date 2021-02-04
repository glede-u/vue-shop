<template>
  <div>
    <img src="../assets/logo.png" alt="">
  </div>
</template>

<script>
import hub from '../utils/hub.js'
export default {
  name: 'Welcome',

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
div{
  position: relative;
  height: 100%;
}
img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
