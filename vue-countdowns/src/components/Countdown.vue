<template>
  <p class="countdown"
     v-bind:class="countdownStatus">
    <span class="description">{{ description }}</span>
    happens in
    <span class="remaining">{{ formattedCountdown }}</span>
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
    },
    formattedCountdown () {
      let remaining = this.remaining
      if (remaining < 1) return 'done'

      const breaks = [
        [60, 's'],
        [60, 'm'],
        [24, 'h'],
        [remaining, 'd']
      ]

      let formatted = ''

      do {
        const brk = breaks.shift()

        formatted = '' + remaining % brk[0] + brk[1] + ' ' + formatted
        remaining = parseInt(remaining / brk[0], 10)
      } while (remaining > 0 && breaks.length)

      return formatted.trim()
    }
  }
}
</script>

<style scoped>
.running .remaining { color: green; }
.ending .remaining { color: orange; }
.done .remaining { color: red; }
</style>
