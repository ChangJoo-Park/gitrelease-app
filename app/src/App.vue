<template lang="html">
  <div>
    <navigation v-bind:connected="isOnline"></navigation>
    <div v-if="isOnline">
      <setting-view class="container" v-if="currentState === 'setting'"></setting-view>
      <new-repo-view class="container" v-if="currentState === 'new'"></new-repo-view>
      <repo-list-view class="container" v-if="currentState === 'list'"></repo-list-view>
    </div>
    <div v-else class="warning-wrapper">
      <div class="warning-item">
        <md-icon class="warning-icon">signal_wifi_off</md-icon>
        <div class="warning-text">Please Check Connection!!</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from 'src/vuex/store'
  // Components
  import Navigation from './components/NavigationView'
  import FooterView from './components/FooterView'
  import NewRepoView from './components/NewRepoView'
  import RepoListView from './components/RepoListView'
  import SettingView from './components/SettingView'
  import { ipcRenderer } from 'electron'
  const MinToMillis = 60000

  export default {
    store,
    components: {
      Navigation,
      FooterView,
      NewRepoView,
      RepoListView,
      SettingView
    },
    data: function () {
      return {
        isOnline: false
      }
    },
    created: function () {
      ipcRenderer.send('db:initialize')
      const vm = this
      // Setting
      ipcRenderer.on('db:response-setting', function (event, setting) {
        console.log('response-setting')
        vm.$store.dispatch('updateSetting', setting)
        vm.isOnline = navigator.onLine
        setInterval(() => { vm.isOnline = navigator.onLine }, 1000)
        setInterval(function () {
          if (vm.isOnline && vm.repositories.length > 0) {
            vm.checkUpdatedRepositories()
          }
        }, setting.refresh * MinToMillis)
      })

      ipcRenderer.on('db:response-repo', function (event, repos) {
        console.log('bind repos', repos)
        vm.$store.dispatch('initializeRepositories', repos)
        vm.checkUpdatedRepositories()
      })
    },
    watch: {
      isOnline: function (newConnection, oldConnection) {
        if (newConnection && this.repositories.length > 0) {
          this.checkUpdatedRepositories()
        }
      }
    },
    computed: {
      currentState: function () {
        return this.$store.getters.currentState
      },
      repositories: function () {
        return this.$store.getters.mainRepositories
      }
    },
    methods: {
      checkUpdatedRepositories: function () {
        const vm = this
        if (vm.repositories.length === 0) {
          console.log('no repositories')
          return
        }
        vm.repositories.forEach(function (repo) {
          console.log(`Check ${repo.full_name}, current ${repo.latest_release.tag_name} ${new Date()}`)
          vm.getLatestRepositories(repo)
          .then(function (latestRelease) {
            // vuex 호출
            // repo 처리
            // vm.$store.dispatch('updateRepository')
          })
          .catch(function () {})
        })
      },
      getLatestRepositories: function (repo) {
        const promise = new Promise(function (resolve, reject) {
          // 현재 repo와 다르면 resolve
          resolve()
          reject()
        })

        return promise
      }
    }
  }
</script>

<style>
* {
  animation-duration: 0.2s
}

.container {
  padding: 16px;
}

.warning-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.warning-item {
  width: 100%;
  text-align: center;
}
.warning-icon {
  font-size: 3em;
  margin-bottom: 1em;
}
.wanring-text {
  font-size: 2em;
  line-height: 2.3em;
}
.md-fab-custom {
  z-index: 1;
  position: fixed;
  right: 16px;
  bottom: 16px;
}
</style>
