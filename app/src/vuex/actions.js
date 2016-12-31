import * as types from './mutation-types'
import { ipcRenderer } from 'electron'

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

export const updateSetting = ({ commit }, setting) => {
  console.log('vuex#updateSetting')
  ipcRenderer.send('db:update-setting', setting)
  ipcRenderer.on('db:update-setting-response', function () {
    console.log('vuex#updateSetting-response')
    commit(types.FETCH_SETTINGS, setting)
  })
}
