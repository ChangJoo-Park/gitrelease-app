import * as types from '../mutation-types'

const state = {
  current: 'list'
}

const mutations = {
  [types.CHANGE_VIEW_STATE] (state, nextState) {
    state.current = nextState
  }
}

export default {
  state,
  mutations
}
