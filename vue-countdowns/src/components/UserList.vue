
<template>
  <div class="user-list">
  <h1>Countdown Users</h1>
<ul>
<li v-for="user in users">
  <router-link :to="{ name: 'CountdownPage', params: { userId: user.id } }">{{ user.id }}</router-link>
</li>
      <li>
        <form v-on:submit.prevent="addUser">
          <input type="text"
                 placeholder="New user email"
                 v-model="newUserEmail">
        </form>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'user-list',
  data () {
    return {
      newUserEmail: ''
    }
  },
  created () {
    this.$store.dispatch('loadUsers')
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    addUser () {
      this.$router.push({
        name: 'CountdownPage',
        params: { userId: this.newUserEmail }
      })
    }
  }
}
</script>

<style scoped>
</style>
