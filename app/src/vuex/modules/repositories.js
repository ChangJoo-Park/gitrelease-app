import * as types from '../mutation-types'

const state = {
  main: []
}

const mutations = {
  [types.INITIALIZE_REPOSITORIES] (state, repos) {
    state.main = repos
  },
  [types.ADD_REPOSITORY] (state, newRepo) {
    const filterItem = state.main.filter(function (repo) {
      return repo.id === newRepo.id
    })
    if (filterItem.length !== 0) {
      return
    }
    state.main.push(newRepo)
    console.log('#ADD_REPOSITORY SUCCESS')
  },
  [types.DESTROY_REPOSITORY] (state, targetRepo) {
    console.log('#DESTROY_REPOSITORY', targetRepo)
    const filterItem = state.main.filter(function (repo) {
      return repo._id === targetRepo._id
    })
    if (filterItem.length === 0) {
      return
    }
    const index = state.main.indexOf(filterItem[0])
    state.main.splice(index, 1)
  }
}

export default {
  state,
  mutations
}
