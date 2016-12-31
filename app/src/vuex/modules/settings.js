import * as types from '../mutation-types'

const state = {
  main: {
    _id: '',
    sort: '',
    refresh: 0
  }
}

const mutations = {
  [types.FETCH_SETTINGS] (state, setting) {
    console.log('vuex#FETCH SETTING', setting)
    state.main._id = setting._id
    state.main.sort = setting.sort
    state.main.refresh = setting.refresh
  },

  [types.UPDATE_SORT_SETTING] (state, newSort) {
    state.main.sort = newSort
  },

  [types.UPDATE_REFRESH_SETTING] (state, newRefresh) {
    state.main.refresh = newRefresh
  }
}

export default {
  state,
  mutations
}
