import * as types from '../mutation-types'

console.log(types)

const state = {
  main: []
}

const mutations = {
  [types.FETCH_REPOSITORIES] (state, repos) {
    state.main = repos
  },
  [types.ADD_REPOSITORY] (state, newRepo) {
    console.log('#ADD_REPOSITORY', newRepo)
  },
  [types.DESTROY_REPOSITORY] (state, targetRepo) {
    console.log('#DESTORY_REPOSITORY', targetRepo)
  }
}

export default {
  state,
  mutations
}
