<template>
<div class="countdown-page">
  <h1>Hello, {{ userId }}</h1>
  <form v-on:submit.prevent="startButtonPressed">
    <label>Countdown to</label>
    <input v-model="form.description" type=text name=description placeholder="Something">
    in
    <input v-model="form.countdown" type=number name=duration placeholder="10">
    <label>seconds</label>
    <button type="submit">Start</button>
  </form>
  <ul class="countdowns" v-if="countdowns.length">
    <li v-for="(countdown, index) in countdowns">
      <countdown :description="countdown.description" :remaining="countdown.remaining"
                 v-on:stop="stopButtonPressed(index)"></countdown>
    </li>
  </ul>
</div>
</template>

<script>
import Countdown from '@/components/Countdown'

export default {
  name: 'countdown-page',
  props: ['userId'],
  components: { Countdown },
  data () {
    return {
      form: {
        description: '',
        countdown: 10
      },
      countdowns: [],
      timer: null
    }
  },
  created () {
    this.timer = setInterval(() => this.updateCountdowns(), 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    startButtonPressed () {
      this.countdowns.push({
        description: this.form.description || 'Something',
        remaining: +this.form.countdown || 10
      })
    },
    stopButtonPressed (index) {
      this.countdowns.splice(index, 1)
    },
    updateCountdowns () {
      this.countdowns.forEach(countdown => {
        if (countdown.remaining > 0) {
          countdown.remaining -= 1
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
