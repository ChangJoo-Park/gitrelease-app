import * as types from './mutation-types'

export const changeViewState = ({ commit }, nextState) => {
  commit(types.CHANGE_VIEW_STATE, nextState)
}
