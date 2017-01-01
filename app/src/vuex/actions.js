import * as types from './mutation-types'
import { ipcRenderer } from 'electron'

export const changeViewState = ({ commit }, nextState) => {
  commit(types.CHANGE_VIEW_STATE, nextState)
}

export const initializeRepositories = ({ commit }, repositories) => {
  commit(types.INITIALIZE_REPOSITORIES, repositories)
}

export const createRepository = ({ commit }, newRepo) => {
  console.log('#createRepository ->', newRepo)
  ipcRenderer.send('db:add-repository', newRepo)
  ipcRenderer.on('db:add-repository-response-success', function () {
    commit(types.ADD_REPOSITORY, newRepo)
  })
}

export const destroyRepository = ({ commit }, targetRepo) => {
  console.log('#destroyRepository', targetRepo)
  ipcRenderer.send('db:remove-repository', targetRepo)
  ipcRenderer.on('db:remove-repository-response', function () {
    console.log('vuex#remove repository response')
    commit(types.DESTROY_REPOSITORY, targetRepo)
  })
}

export const updateSetting = ({ commit }, setting) => {
  console.log('vuex#updateSetting')
  ipcRenderer.send('db:update-setting', setting)
  ipcRenderer.on('db:update-setting-response', function () {
    console.log('vuex#updateSetting-response')
    commit(types.FETCH_SETTINGS, setting)
  })
}
