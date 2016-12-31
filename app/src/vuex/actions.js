import * as types from './mutation-types'

export const changeViewState = ({ commit }, nextState) => {
  commit(types.CHANGE_VIEW_STATE, nextState)
}

export const updateRepository = ({ commit }, updatedRepo) => {
}

export const fetchRepository = ({ commit }, repositories) => {
}

export const createRepository = ({ commit }, newRepo) => {
}

export const destroyRepository = ({ commit }, targetRepo) => {
}
