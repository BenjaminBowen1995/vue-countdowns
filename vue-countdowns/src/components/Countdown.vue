<template>
  <p class="countdown"
     v-bind:class="countdownStatus">
    <span class="description">{{ description }}</span>
    happens in
    <span class="remaining">{{ remaining }}</span>
    <button v-on:click="$emit('stop')">Stop</button>
  </p>
</template>
 
<script>
export default {
  name: 'countdown',
  props: ['description', 'remaining'],
  computed: {
    countdownStatus () {
      return (this.remaining > 0)
           ? (this.remaining < 4 ? 'ending' : 'running')
           : 'done'
    }
  }
}
</script>
 
<style scoped>
.running .remaining { color: green; }
.ending .remaining { color: orange; }
.done .remaining { color: red; }
</style>