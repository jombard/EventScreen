import axios from 'axios'
export default {
  state: {
    data: []
  },
  mutations: {
    setEventData (state, data) {
      Object.keys(state).map(key => {
        if (Array.isArray(data[key])) {
          state[key] = data[key]
          return state[key]
        }
      })
    },
    emptyEventData (state) {
      Object.keys(state).map(key => {
        state[key] = []
        return state[key]
      })
    }
  },
  actions: {
    getEventData () {
      let vm = this
      vm.commit('emptyEventData')

      axios.get('/json/event.json', {})
        .then(response => {
          // Simulate server delay
          setTimeout(function () {
            if (response.data) { vm.commit('setEventData', response.data) }
          }, 500)
        })
        .catch(error => {
          // Error handling
          console.log('Check for auth permission /n' + error.response)
        })
    }
  }
}
