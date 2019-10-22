import axios from 'axios'
export default {
  state: {
    data: []
  },
  mutations: {
    setCategoryData (state, data) {
      Object.keys(state).map(key => {
        if (Array.isArray(data[key])) {
          state[key] = data[key]
          return state[key]
        }
      })
    },
    emptyCategoryData (state) {
      Object.keys(state).map(key => {
        state[key] = []
        return state[key]
      })
    }
  },
  actions: {
    getCategoryData () {
      let vm = this
      vm.commit('emptyCategoryData')
      axios.get('/json/category.json', {})
        .then(response => {
          // Simulate server delay
          setTimeout(function () {
            if (response.data) { vm.commit('setCategoryData', response.data) }
          }, 500)
        })
        .catch(error => {
          // Error handling
          console.log('Check for auth permission /n' + error.response)
        })
    }
  }
}
