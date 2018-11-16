import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    token: 0
  },
  mutations: {
    // increment (state) {
    //   state.counter++
    // }
    setToken (state) {
      state.token++
    }
  }
});

export default store
