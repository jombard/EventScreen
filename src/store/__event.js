import axios from 'axios'

export default {
  state: {
    data: [],
    isLoading : false
  },
  mutations: {
    setEventData (state, data) {
      // Object.keys(state).map(key => {
      //   if (Array.isArray(data[key])) {
      //     state[key] = data[key]
      //     return state[key]
      //   }
      // })
      state.data = data.data
      state.isLoading = false
    },
    emptyEventData (state) {
      // Object.keys(state).map(key => {
      //   state[key] = []
      //   return state[key]
      // })
      state.data = []
      state.isLoading = true
    }
  },
  actions: {
    getEventData () {
      let vm = this
      vm.commit('emptyEventData')
      // vm.state.isLoading = true
      axios.get('/json/event.json', {})
        .then(response => {
          // Simulate server delay
          setTimeout(function () {
            if (response.data) { 
              vm.commit('setEventData', response.data) 
            }
            // vm.state.isLoading = false
          }, 500)
        })
        .catch(error => {
          // Error handling
          console.log('Check for auth permission /n' + error.response)
        })
    }
  }
}
