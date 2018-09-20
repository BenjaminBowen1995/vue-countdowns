import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const DUMMY_USERS = [
  { id: 'countdown-user@bjss.com', countdowns: [] },
  { id: 'someone-else@bjss.com', countdowns: [] }
]

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
      commit('setUsers', DUMMY_USERS)
    },
    loadCountdownsForUser ({commit}, userId) {
      const userData = DUMMY_USERS.find(user => user.id === userId) || {}
      commit('setCountdowns', userData.countdowns || [])
      commit('setCurrentUserId', userId)
    },
    addCountdown ({commit, state, dispatch}, {description, remaining}) {
      // amend the DUMMY_USERS array with the new countdown (and possibly new user) then reload
      const newCountdown = {
        description,
        endDateTime: Date.now() + remaining * 1000
      }
      const userData = DUMMY_USERS.find(user => user.id === state.currentUserId)

      if (userData) {
        userData.countdowns.push(newCountdown)
      } else {
        DUMMY_USERS.push({
          id: state.currentUserId,
          countdowns: [newCountdown]
        })
      }
      dispatch('loadCountdownsForUser', state.currentUserId)
    },
    removeCountdownAtIndex ({commit, state, dispatch}, index) {
      // again, amend the DUMMY_USERS array then reload
      const userData = DUMMY_USERS.find(user => user.id === state.currentUserId) || {}
      if (userData) {
        userData.countdowns.splice(index, 1)
        dispatch('loadCountdownsForUser', state.currentUserId)
      }
    },
    updateCountdowns ({commit}) {
      commit('setCurrentDateTime', Date.now())
    }
  }
})
