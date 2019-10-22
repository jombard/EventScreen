import axios from 'axios'
export default {
  state: {
    data: []
  },
  mutations: {
    setCountryData (state, data) {
      Object.keys(state).map(key => {
        if (Array.isArray(data[key])) {
          state[key] = data[key]
          return state[key]
        }
      })
    },
    emptyCountryData (state) {
      Object.keys(state).map(key => {
        state[key] = []
        return state[key]
      })
    }
  },
  actions: {
    getCountryData () {
      let vm = this
      vm.commit('emptyCountryData')

      axios.get('/json/country.json',{})
        .then(response => {
          // Simulate server delay
          setTimeout(function () {
            if (response.data) { vm.commit('setCountryData', response.data) }
          }, 500)
        })
        .catch(error => {
          // Error handling
          console.log('Check for auth permission /n' + error.response)
        })
    }
  }
}
