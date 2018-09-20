import 'whatwg-fetch'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    currentUserId: null,
    countdownStorage: [],
    currentDateTime: Date.now()
  },
  getters: {
    countdowns: state => {
      const currentTime = state.currentDateTime
      return state.countdownStorage.map(({description, endDateTime}) => {
        return {
          description,
          remaining: parseInt((endDateTime - currentTime) / 1000)
        }
      })
    }
  },
  mutations: {
    setUsers (state, users) {
      state.users = users
    },
    setCurrentUserId (state, userId) {
      state.currentUserId = userId
    },
    setCountdowns (state, countdowns) {
      state.countdownStorage = countdowns
    },
    setCurrentDateTime (state, newCurrentDateTime) {
      state.currentDateTime = newCurrentDateTime
    }
  },
  actions: {
    // actions receive a context object but we only need the commit function property
    loadUsers ({commit}) {
      return fetch('/api/users')
              .then(response => response.json())
              .then(body => {
                const users = body.users.map(id => ({id}))
                commit('setUsers', users)
              })
    },
    loadCountdownsForUser ({commit}, userId) {
      return fetch(`/api/countdowns/${userId}`)
              .then(response => response.json())
              .then(body => {
                const countdowns = body.countdowns.map(countdown => {
                  return {description: countdown.description, endDateTime: new Date(countdown.endDateTime)}
                })
                commit('setCountdowns', countdowns)
                commit('setCurrentUserId', userId)
              })
    },
    saveCountdownsForCurrentUser ({commit, state}) {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({countdowns: state.countdownStorage})
      }
      return fetch(`/api/countdowns/${state.currentUserId}`, options)
    },
    addCountdown ({commit, state, dispatch}, {description, remaining}) {
      const countdowns = state.countdownStorage
      countdowns.push({
        description,
        endDateTime: Date.now() + remaining * 1000
      })
      commit('setCountdowns', countdowns)
      dispatch('saveCountdownsForCurrentUser')
    },
    removeCountdownAtIndex ({commit, state, dispatch}, index) {
      const countdowns = state.countdownStorage
      countdowns.splice(index, 1)
      commit('setCountdowns', countdowns)
      dispatch('saveCountdownsForCurrentUser')
    },
    updateCountdowns ({commit}) {
      commit('setCurrentDateTime', Date.now())
    }
  }
})
